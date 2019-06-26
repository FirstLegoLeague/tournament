'use strict'
const express = require('express')
const { Logger } = require('@first-lego-league/ms-logger')

const db = require('../utilities/mongo_connection')

const MsLogger = new Logger()
const router = new express.Router()

router.get('/:stage/nextId', (req, res) => {
  db.connection().then(connection => {
    return connection.db().collection('matches')
      .find({ 'stage': req.params.stage })
      .sort({ matchId: -1 })
      .limit(1)
      .toArray()
      .then(data => {
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
