'use strict'
const express = require('express')

const MsLogger = require('@first-lego-league/ms-logger').Logger()

const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const {getCurrentMatch, getNextMatches, getCurrentMatchNumber, setCurrentMatchNumber} = require('../logic/tournament_status_logic')

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
      setCurrentMatchNumber(parseInt(req.body.match)).then(result => {
        res.send('').status(200)
      }).catch(error => {
        MsLogger.error(error.message)
        res.status(400).send({error: error.message})
      })
    } else {
      res.sendStatus(415)
    }
  })

  return router
}
