'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

exports.getRouter = function () {
  const router = express.Router()

  router.get('/match/all/:number', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection('matches').then(data => {
        if (!data) {
          res.sendStatus(404)
          return
        }
        
        console.log(data)
      })
    }).catch(err => {
      console.log(err)
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
