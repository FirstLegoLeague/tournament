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
    res.json(getMatchLogic.getMatch())
  })

  router.put('/current/set', adminAction, (req, res) => {
    console.log('In the post request', req)
    if (parseInt(req.body.match)) {
      getMatchLogic.setMatch(parseInt(req.body.match))
      res.sendStatus(200)
    } else {
      res.sendStatus(415)
    }
  })
  return router
}
