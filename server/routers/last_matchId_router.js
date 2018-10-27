'use strict'
const express = require('express')
const db = require('../utilities/mongo_connection')
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const router = express.Router()

router.get('/:stage/nextId', (req, res) => {
  db.connection().then(connection => {
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
