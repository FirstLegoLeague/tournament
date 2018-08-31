'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

const router = express.Router()

router.get('/:stage/nextId', (req, res) => {
  MongoClient.connect(MONGU_URI).then(connection => {
    connection.db().collection('matches').find({ 'stage': req.params.stage }).sort({ matchId: -1 }).limit(1).toArray().then(data => {
      if (data.length >= 1) {
        res.status(200).send({ nextMatchId: data[0].matchId + 1 })
      } else {
        res.status(200).send({ nextMatchId: 1 })
      }
    })
  }).catch(err => {
    MsLogger.error(err.message)
    res.status(500).send()
  })
})

exports.router = router
