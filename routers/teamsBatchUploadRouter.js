'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const teamsBatchParser = require('../logic/teamsBatchParser')

const MONGU_URI = process.env.MONGO_URI

const adminAction = authroizationMiddlware(['admin', 'development'])

exports.getRouter = function () {
  const router = express.Router()

  router.post('/batch', adminAction, (req, res) => {
    if (!req.body.teamsData) {
      return res.status(400).send('Please provide data..')
    }

    if (!req.body.delimiter) {
      return res.status(400).send('Please provide delimiter..')
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
