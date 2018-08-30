'use strict'
const express = require('express')
const requestify = require('requestify')

const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const mhubConnection = require('../Utils/mhubConnection')

const adminAction = authroizationMiddlware(['admin', 'development'])

const tournamentDataParser = require('../logic/tournamentDataParser')

router.get('/parse', (req, res) => {
  if (!req.query.tourData) {
    return res.status(400).send('Please provide data..')
  }

  if (!req.query.delimiter) {
    return res.status(400).send('Please provide delimiter..')
  }

  res.send(tournamentDataParser.parse(req.query.tourData, req.query.delimiter))
})

router.post('/', adminAction, (req, res) => {
  if (!req.body.tourData) {
    res.status(400).send('Please provide data..')
  }

  if (!req.body.delimiter) {
    res.status(400).send('Please provide delimiter..')
  }

  const data = tournamentDataParser.parse(req.body.tourData, req.body.delimiter)
  MongoClient.connect(process.env.MONGO_URI).then(conn => {
    if (data.tables) {
      conn.db().collection('tables').insertMany(data.tables).then(() => {
        MsLogger.info('Data saved successfully to collection tables')
      }).catch(err => {
        MsLogger.error('Something went wrong while saving data \n' + err)
      })

      mhubConnection.publishUpdateMsg('tables')
    }

    conn.db().collection('teams').insertMany(data.teams).then(() => {
      MsLogger.info('Data saved successfully to collection teams')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    mhubConnection.publishUpdateMsg('teams')

    if (data.practiceMatches) {
      conn.db().collection('matches').insertMany(data.practiceMatches).then(() => {
        MsLogger.info('practice matches saved successfully to collection matches')
      }).catch(err => {
        MsLogger.error('Something went wrong while saving data \n' + err)
      })
    }

    if (data.rankingMatches) {
      conn.db().collection('matches').insertMany(data.rankingMatches).then(() => {
        MsLogger.info('ranking matches successfully to collection ranking-matches')
      }).catch(err => {
        MsLogger.error('Something went wrong while saving data \n' + err)
      })
    }

    if (data.rankingMatches || data.practiceMatches) {
      mhubConnection.publishUpdateMsg('matches')
    }

    res.sendStatus(201)
  }).catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

if (!process.env.DEV) {
  router.delete('/', adminAction, (req, res) => {
    requestify.get(`${process.env.MODULE_SCORING_URL}/scores/count`).then(response => {
      const body = response.getBody()
      if (body.count > 0) {
        MsLogger.error(`There are ${body.count} matches. Cant delete data.`)
        res.status(405).send()
        return
      }

      dropCollectionsInDatabase().then(() => {
        mhubConnection.publishUpdateMsg('matches')
        mhubConnection.publishUpdateMsg('teams')
        mhubConnection.publishUpdateMsg('tables')
        res.status(200).send()
      }).catch(error => {
        MsLogger.error(`Error deleting data: \n ${error}`)
        res.status(500).send('There was an error deleting data')
      })
    })
  }).catch(err => {
    MsLogger.error(`Error getting the matches count \n ${err}`)
    res.status(405).send()
  })
}

if (process.env.DEV) {
  router.delete('/', adminAction, (req, res) => {
    dropCollectionsInDatabase().then(() => {
      mhubConnection.publishUpdateMsg('matches')
      mhubConnection.publishUpdateMsg('teams')
      mhubConnection.publishUpdateMsg('tables')
      res.status(200).send()
    }).catch(error => {
      MsLogger.error(`Error deleting data: \n ${error}`)
      res.status(500).send('There was an error deleting data')
    })
  })
}

function dropCollectionsInDatabase () {
  return MongoClient.connect(process.env.MONGO_URI).then(conn => {
    const matchesCollection = conn.db().collection('matches')
    const teamsCollection = conn.db().collection('teams')
    const tablesCollection = conn.db().collection('tables')

    const collections = [
      {
        collection: matchesCollection
      },
      {
        collection: teamsCollection
      },
      {
        collection: tablesCollection
      }
    ]

    const collectionsExistsPromises = []
    for (let i = 0; i < collections.length; i++) {
      collectionsExistsPromises.push(collections[i].collection.find().toArray())
    }
    return Promise.all(collectionsExistsPromises).then(returned => {
      const dropPromises = []
      for (let i = 0; i < returned.length; i++) {
        if (returned[i].length > 0) {
          dropPromises.push(collections[i].collection.drop())
        }
      }

      return Promise.all(dropPromises)
    })
  })
}

module.exports = router
