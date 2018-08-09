'use strict'
const express = require('express')

const mhubConnection = require('../Utils/mhubConnection')
const getMatchLogic = require('../logic/getMatchLogic')

const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

exports.getRouter = function () {
  const router = express.Router()

  router.get('/current', (req, res) => {
    getMatchLogic.getCurrentMatch().then(data => {
      if (data) {
        mhubConnection.publishUpdateMsg('CurrentMatches', data)
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    })
  })

  router.get('/upcoming', (req, res) => {
    Promise.all(getMatchLogic.getNextMatches()).then(data => data.filter(data => data)).then(data => {
      if (data && data.length > 0) {
        mhubConnection.publishUpdateMsg('UpcomingMatches', data)
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    })
  })

  router.get('/matchNumber', (req, res) => {
    res.send(getMatchLogic.getMatch().toString())
  })

  router.get('/match/:matchNumber', (req, res) => {
    if (parseInt(req.params.matchNumber)) {
      res.send(getMatchLogic.getSpecificMatch(parseInt(req.params.matchNumber)))
    } else {
      res.sendStatus(415)
    }
  })

  router.get('/setMatchNumber/:matchNumber', (req, res) => {
    if (parseInt(req.params.matchNumber)) {
      getMatchLogic.setMatch(parseInt(req.params.matchNumber))
      res.sendStatus(200)
    } else {
      res.sendStatus(415)
    }
  })
  return router
}
