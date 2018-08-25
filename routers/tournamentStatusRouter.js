'use strict'
const express = require('express')

const { getCurrentMatch, getNextMatches, getCurrentMatchNumber, setCurrentMatchNumber } = require('../logic/tournamentStatusLogic')
const {Logger} = require('@first-lego-league/ms-logger')
const logger = Logger()

const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

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
      logger.error(err)
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
      logger.error(err)
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

  return router
}
