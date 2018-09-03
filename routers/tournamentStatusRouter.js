'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const {getCurrentMatch, getNextMatches, getCurrentMatchNumber, setCurrentMatchNumber} = require('../logic/tournamentStatusLogic')
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

exports.getRouter = function () {
  const router = express.Router()

  router.get('/current', (req, res) => {
    getCurrentMatch().then(data => {
      if (data) {
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    }).catch(err => {
      MsLogger.error(err)
      res.status(500).send('The server encounter a problem while the current match')
    })
  })

  router.get('/upcoming', (req, res) => {
    getNextMatches().then(matches => {
      if (matches) {
        res.send(matches)
      } else {
        res.sendStatus(404)
      }
    }).catch(err => {
      MsLogger.error(err)
      res.status(500).send('The server encounter a problem while fetching upcoming matches')
    })
  })

  router.get('/matchNumber', (req, res) => {
    res.json(getCurrentMatchNumber())
  })

  router.put('/current', adminAction, (req, res) => {
    if (parseInt(req.body.match)) {
      setCurrentMatchNumber(parseInt(req.body.match))
      res.sendStatus(200)
    } else {
      res.sendStatus(415)
    }
  })

  router.get('/:stage/nextId', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection('matches').find({'stage': req.params.stage}).sort({matchId: -1}).limit(1).toArray().then(data => {
        if (data.length >= 1) {
          res.status(200).send({nextMatchId: data[0].matchId + 1})
        } else {
          res.status(200).send({nextMatchId: 1})
        }
      })
      connection.close()
    }).catch(err => {
      MsLogger.error(err.message)
      res.status(500).send()
    })
  })
  return router
}
