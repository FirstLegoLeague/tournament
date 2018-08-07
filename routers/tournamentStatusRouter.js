'use strict'
const express = require('express')

const getMatchLogic = require('../logic/getMatchLogic')

exports.getRouter = function () {
  const router = express.Router()

  router.get('/current', (req, res) => {
    getMatchLogic.getCurrentMatch().then(data => {
      if (data) {
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    })
  })

  router.get('/upcoming', (req, res) => {
    Promise.all(getMatchLogic.getNextMatches()).then(data => data.filter(data => data)).then(data => {
      if (data && data.length > 0) {
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    })
  })

  return router
}
