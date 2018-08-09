'use strict'
const MongoClient = require('mongodb').MongoClient
const {MHUB_NODES, publishMsg} = require('../Utils/mhubConnection')

const MONGU_URI = process.env.MONGO_URI
const SETTING_COLLECTION_NAME = 'settings'

function setDefaultSettings () {
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

function getSetting (settingName) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection(SETTING_COLLECTION_NAME)
      .findOne({})
      .then(data => {
        if (!data) {
          return data
        }

        return data[settingName]
      })
  })
}

function updateSetting (settingName, value) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    const setDocument = {}
    setDocument[settingName] = value
    return connection.db().collection(SETTING_COLLECTION_NAME)
      .findOneAndUpdate({}, {$set: setDocument})
      .then(dbResponse => {
        if (dbResponse.ok == 1) {

          if(settingName == 'tournamentLevel'){
            publishMsg(MHUB_NODES.PROTECTED, 'stage:updated', {value})
          }

          return true
        }
      })
  })
}

module.exports = {
  'getSetting': getSetting,
  'updateSetting': updateSetting,
  'setDefaultSettings': setDefaultSettings
}