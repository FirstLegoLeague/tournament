'use strict'
const MongoClient = require('mongodb').MongoClient

const { MHUB_NODES, publishMsg } = require('../Utils/mhubConnection')

const MONGU_URI = process.env.MONGO_URI
const SETTING_COLLECTION_NAME = 'settings'

function setDefaultSettings () {
  const defaultSettings = {
    'tournamentStage': 'practice',
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

function getAllSettings () {
  return MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection(SETTING_COLLECTION_NAME)
      .findOne({})
      .then(data => {
        const settings = data
        delete settings._id
        return settings
      })
  })
}

function getSetting (settingName) {
  return getAllSettings()
    .then(data => {
      if (!data) {
        return data
      }

      return data[settingName]
    })
}

function updateSetting (settingName, value) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    const setDocument = {}
    setDocument[settingName] = value
    return connection.db().collection(SETTING_COLLECTION_NAME)
      .findOneAndUpdate({}, { $set: setDocument })
      .then(dbResponse => {
        if (dbResponse.ok == 1) {
          publishMsg(MHUB_NODES.PROTECTED, `${settingName}:updated`, { value })
          return true
        }
      })
  })
}

function getAllStages () {
  return MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection('matches').distinct('stage', {})
  })
}

module.exports = {
  getSetting,
  getAllSettings,
  updateSetting,
  setDefaultSettings,
  getAllStages
}
