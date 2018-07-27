'use strict'
const express = require('express')

const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const mhubConnection = require('../Utils/mhubConnection')

const adminAction = authroizationMiddlware(['admin', 'development'])

const tournamentDataParser = require('../logic/tournamentDataParser')

router.get('/parse', (req, res) => {
  if (!req.query.tourData) {
    res.status(400)
    res.send('Please provide data..')
  }

  if (!req.query.delimiter) {
    res.status(400)
    res.send('Please provide delimiter..')
  }

  res.send(tournamentDataParser.parse(req.query.tourData, req.query.delimiter))
})

router.post('/', adminAction, (req, res) => {
  if (!req.body.tourData) {
    res.status(400)
    res.send('Please provide data..')
  }

  if (!req.body.delimiter) {
    res.status(400)
    res.send('Please provide delimiter..')
  }

  const data = tournamentDataParser.parse(req.body.tourData, req.body.delimiter)
  MongoClient.connect(process.env.MONGO_URI).then(conn => {
    conn.db().collection('tables').insertMany(data.tables).then(() => {
      MsLogger.info('Data saved successfully to collection tables')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    conn.db().collection('teams').insertMany(data.teams).then(() => {
      MsLogger.info('Data saved successfully to collection teams')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    conn.db().collection('matches').insertMany(data.practiceMatches).then(() => {
      MsLogger.info('practice matches saved successfully to collection matches')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    conn.db().collection('matches').insertMany(data.rankingMatches).then(() => {
      MsLogger.info('ranking matches successfully to collection ranking-matches')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    mhubConnection.publishUpdateMsg('teams')
    mhubConnection.publishUpdateMsg('tables')
    mhubConnection.publishUpdateMsg('matches')
    res.status(201)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

  res.sendStatus(201)
})

module.exports = router
