'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const teamsBatchParser = require('../logic/teamsBatchParser')

const MONGU_URI = process.env.MONGO_URI

exports.getRouter = function () {
  const router = express.Router()

  router.post('/batch', (req, res) => {
    if (!req.body.teamsData) {
      res.status(400)
      res.send('Please provide data..')
    }

    if (!req.body.delimiter) {
      res.status(400)
      res.send('Please provide delimiter..')
    }

    MongoClient.connect(MONGU_URI).then(connection => {
      const teams = teamsBatchParser.parse(req.body.teamsData, req.body.delimiter)
      return connection.db().collection('teams').insertMany(teams).then(() => {
        res.status(201).send()
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
