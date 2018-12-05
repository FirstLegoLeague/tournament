'use strict'
const db = require('../utilities/mongo_connection')
const logger = require('@first-lego-league/ms-logger').Logger()
const {MHUB_NODES, publishMsg} = require('../utilities/mhub_connection')

const SETTING_COLLECTION_NAME = 'settings'

function setDefaultSettings () {
  const defaultSettings = {
    'tournamentStage': 'practice',
    'tournamentTitle': 'World Festival Houston 2019',
    'numberOfPracticeRounds': 1,
    'numberOfRankingRounds': 3
  }

  db.connection().then(connection => {
    connection.db().collection(SETTING_COLLECTION_NAME).findOne({}).then(response => {
      const promises = []
      if (response.length > 0) {
        response = response[0]
        for (const setting of Object.keys(defaultSettings)) {
          if (!response[setting]) {
            const toSet = {}
            toSet[setting] = defaultSettings[setting]
            promises.push(connection.db().collection(SETTING_COLLECTION_NAME).updateOne({}, {
              $set: toSet
            }))
          }
        }
        return Promise.all(promises)
      } else {
        return connection.db().collection(SETTING_COLLECTION_NAME).insert(defaultSettings)
      }
    })
  })
}

function getAllSettings () {
  return db.connection().then(connection => {
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
  return db.connection().then(connection => {
    const setDocument = {}
    setDocument[settingName] = value
    return connection.db().collection(SETTING_COLLECTION_NAME)
      .findOneAndUpdate({}, {$set: setDocument})
      .then(dbResponse => {
        if (dbResponse.ok == 1) {
          publishMsg(MHUB_NODES.PROTECTED, `${settingName}:updated`, {value})
          logger.info(`Updated setting ${settingName} With value: ${value} Successfully`)
          return true
        }
      }).catch(err => {
        logger.warn(`Could not save ${settingName} with value: ${value}. Error: ${err.message}`)
      })
  })
}

function getAllStages () {
  return db.connection().then(connection => {
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
