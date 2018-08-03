'use strict'
const express = require('express')

const getMatchLogic = require('../logic/getMatchLogic')

exports.getRouter = function () {
  const router = express.Router()

  router.get('/currentMatch', (req, res) => {
    res.send(getMatchLogic.getCurrentMatch())
  })

  router.get('/upcomingMatches', (req, res) => {
    res.send(getMatchLogic.getNextMatches())
  })

  return router
}
