const express = require('express')
const { Logger } = require('@first-lego-league/ms-logger')
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const { getSetting, getAllSettings, updateSetting, setDefaultSettings, getAllStages } = require('../logic/settings_logic')

const MsLogger = new Logger()
const adminAction = authroizationMiddlware(['admin', 'development'])

setDefaultSettings()

exports.getSettingsRouter = function () {
  const router = new express.Router()

  router.get('/all', (req, res) => {
    getAllSettings().then(settings => {
      res.json(settings)
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/stages', (req, res) => {
    getAllStages().then(data => {
      if (data.length === 0 || !data) {
        res.status(200).json(['practice', 'ranking'])
        return
      }

      res.send(data)
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

      res.json(data)
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
