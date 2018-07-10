'use strict'
const express = require('express')

const router = express.Router()
const domain = require('domain')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const { getCorrelationId, correlateSession } = require('@first-lego-league/ms-correlation')
const { MClient } = require('mhub')

const { getFieldDefaultValue } = require('../Utils/configuration')

const adminAction = authroizationMiddlware(['admin', 'development'])

const mhubClient = new MClient(process.env.MHUB)
mhubClient.on('error', msg => {
  domain.create().run(() => {
    correlateSession()
    MsLogger.error('Unable to connect to mhub, other modules won\'t be notified about this change \n ' + msg)
  })
})

const tournamentDataParser = require('../logic/tournamentDataParser')

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
  MongoClient.connect(process.env.MONGO).then(conn => {
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

    mhubClient.connect().then(() => {
      mhubClient.publish(getFieldDefaultValue('mhub', 'node'), 'all:reload', {
        'client-id': getFieldDefaultValue('mhub', 'client-id'),
        'correlation-id': getCorrelationId()
      })
    })

    res.status(201)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

  res.send()
})

module.exports = router
