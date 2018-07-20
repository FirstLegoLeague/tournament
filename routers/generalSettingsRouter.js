'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

const MONGU_URI = process.env.MONGO_URI
const SETTING_COLLECTION_NAME = 'settings'

exports.setDefaultSettings = function () {
  const defaultSettings = {
    'tournamentLevel': 'practice',
    'tournamentTitle': 'World Festival 2018'
  }
  MongoClient.connect(MONGU_URI).then(connection => {
    connection.db().collection(SETTING_COLLECTION_NAME).findOne().then(response => {
      if (!response) {
        return connection.db().collection(SETTING_COLLECTION_NAME).insert(defaultSettings)
      }
    })
  })
}

exports.getSettingsRouter = function () {
  const router = express.Router()

  router.get('/:setting', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(SETTING_COLLECTION_NAME).findOne().then(data => {
        if (!data) {
          res.sendStatus(404)
          return
        }

        res.send(data[req.params.setting])
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.put('/:setting', adminAction, (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      const setDocument = {}
      setDocument[req.params.setting] = req.body[req.params.setting]
      connection.db().collection(SETTING_COLLECTION_NAME).findOneAndUpdate({}, { $set: setDocument })
        .then(dbResponse => {
          if (dbResponse.ok === 1) {
            res.sendStatus(204)
          }
        })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
