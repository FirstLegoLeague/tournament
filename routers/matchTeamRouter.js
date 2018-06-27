'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const Team = require('../models/Team')
const Match = require('../models/Match')
const Table = require('../models/Table')

const MONGU_URI = process.env.MONGO

exports.getRouter = function () {
  const router = express.Router()

  router.get('/:team/matches', (req, res) => {
    MsLogger.debug(req.params.team)
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection('matches').find({ 'matchTeams.teamNumber': parseInt(req.params.team) }).toArray().then(data => {
        if (!data) {
          res.sendStatus(404)
          return
        }

        res.send(data)
      })
    }).catch(err => {
      console.log(err)
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
