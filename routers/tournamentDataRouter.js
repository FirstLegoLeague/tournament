'use strict'
const express = require('express')

const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger

const tournamentDataParser = require('../logic/tournamentDataParser')

router.post('/', (req, res) => {
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

    conn.db().collection('practice-matches').insertMany(data.practiceMatches).then(() => {
      MsLogger.info('Data saved successfully to collection practice-matches')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    conn.db().collection('ranking-matches').insertMany(data.rankingMatches).then(() => {
      MsLogger.info('Data saved successfully to collection ranking-matches')
    }).catch(err => {
      MsLogger.error('Something went wrong while saving data \n' + err)
    })

    res.status(201)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

  res.send()
})

module.exports = router
