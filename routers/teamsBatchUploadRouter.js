'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const teamsBatchParser = require('../logic/teamsBatchParser')

const MONGU_URI = process.env.MONGO_URI

exports.getRouter = function () {
  const router = express.Router()

  router.post('/batch', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      const teams = teamsBatchParser.parse(req.body)
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
