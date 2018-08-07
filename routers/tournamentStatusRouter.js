'use strict'
const express = require('express')

const getMatchLogic = require('../logic/getMatchLogic')

exports.getRouter = function () {
  const router = express.Router()

  router.get('/current', (req, res) => {
    getMatchLogic.getCurrentMatch().then(data => {
      res.send(data)
    })
  })

  router.get('/upcoming', (req, res) => {
    Promise.all(getMatchLogic.getNextMatches()).then(data => {
      res.send(data)
    })
  })

  return router
}
