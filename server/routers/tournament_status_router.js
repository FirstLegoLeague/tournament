'use strict'
const express = require('express')

const MsLogger = require('@first-lego-league/ms-logger').Logger()

const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const {getCurrentMatch, getNextMatches, getCurrentMatchNumber, setCurrentMatchNumber, getNextMatchForTable} = require('../logic/tournament_status_logic')

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

  router.get('/upcoming/:amount?', (req, res) => {
    let amount = 2
    if (req.params.amount) {
      try {
        amount = parseInt(req.params.amount)
      } catch (e) {
        res.status(400).send('Amount need to be a number')
      }
    }

    getNextMatches(amount).then(matches => {
      if (matches) {
        res.send(matches)
      } else {
        res.sendStatus(404)
      }
    }).catch(err => {
      MsLogger.error(err.message)
      res.status(500).send('The server encounter a problem while fetching upcoming matches')
    })
  })

  router.get('/upcoming/table/:tableId/:amount?', (req, res) => {
    let amount = 1
    if (req.params.amount) {
      try {
        amount = parseInt(req.params.amount)
      } catch (e) {
        res.status(400).send('Amount need to be a number')
      }
    }

    if (!req.params.tableId) {
      res.status(400).send('Please provide table id')
    } else {
      try {
        let tableId = parseInt(req.params.tableId)
        return getNextMatchForTable(tableId, amount)
          .then(match => {
            if (match) {
              res.send(match)
            } else {
              res.sendStatus(404)
            }
          })
          .catch(err => {
            MsLogger.error(err.message)
            res.status(500).send(`The server encounter a problem while fetching upcoming matches for table ${tableId}`)
          })
      } catch (e) {
        res.status(500).send(e.message)
      }
    }
  })

  router.get('/matchNumber', (req, res) => {
    getCurrentMatchNumber().then(match => {
      res.json(match)
    })
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
