'use strict'
const express = require('express')

const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const msLogger = require('@first-lego-league/ms-logger')

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
      // TODO: use ms-logger
      console.log('all good')
    }).catch(err => {
      // TODO: use ms-logger
      console.log(err)
    })

    conn.db().collection('teams').insertMany(data.teams).then(() => {
      // TODO: use ms-logger
      console.log('all good')
    }).catch(err => {
      // TODO: use ms-logger
      console.log(err)
    })

    conn.db().collection('practice-matches').insertMany(data.practiceMatches).then(() => {
      // TODO: use ms-logger
      console.log('all good')
    }).catch(err => {
      // TODO: use ms-logger
      console.log(err)
    })

    conn.db().collection('ranking-matches').insertMany(data.rankingMatches).then(() => {
      // TODO: use ms-logger
      console.log('all good')
    }).catch(err => {
      // TODO: use ms-logger
      console.log(err)
    })

    res.status(201)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

  res.send()
})

module.exports = router
