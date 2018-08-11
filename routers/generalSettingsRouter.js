'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const { getSetting, getAllSettings, updateSetting, setDefaultSettings } = require('../logic/tournamentSettingsLogic')

const adminAction = authroizationMiddlware(['admin', 'development'])

setDefaultSettings()

exports.getSettingsRouter = function () {
  const router = express.Router()

  router.get('/all', (req, res) => {
    getAllSettings().then(settings => {
      res.json(settings)
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/:setting', (req, res) => {
    getSetting(req.params.setting).then(data => {
      if (!data) {
        res.sendStatus(404)
      }

      res.send(data)
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.put('/:setting', adminAction, (req, res) => {
    updateSetting(req.params.setting, req.body[req.params.setting]).then(() => {
      res.sendStatus(204)
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
