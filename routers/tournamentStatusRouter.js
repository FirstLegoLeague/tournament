'use strict'
const express = require('express')

const getMatchLogic = require('../logic/getMatchLogic')

exports.getRouter = function () {
  const router = express.Router()

  router.get('/currentMatch', (req, res) => {
    res.send(getMatchLogic.getCurrentMatch())
  })

  return router
}
