'use strict'
const express = require('express')
const db = require('../utilities/mongo_connection')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const {publishUpdateMsg} = require('../utilities/mhub_connection')

const teamsBatchParser = require('../logic/teams_batch_parser')

const adminAction = authroizationMiddlware(['admin', 'development'])

exports.getRouter = function () {
  const router = express.Router()

  router.get('/batch/parse', (req, res) => {
    if (!req.query.teamsData) {
      return res.status(400).send('Please provide data..')
    }

    if (!req.query.delimiter) {
      return res.status(400).send('Please provide delimiter..')
    }

    res.send(teamsBatchParser.parse(req.query.teamsData, req.query.delimiter))
  })

  router.post('/batch', adminAction, (req, res) => {
    if (!req.body.teamsData) {
      return res.status(400).send('Please provide data..')
    }

    if (!req.body.delimiter) {
      return res.status(400).send('Please provide delimiter..')
    }

    const teams = teamsBatchParser.parse(req.body.teamsData, req.body.delimiter).teams
    db.connection().then(connection => {
      return connection.db().collection('teams').insertMany(teams).then(() => {
        publishUpdateMsg('teams')
        res.status(201).send()
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
