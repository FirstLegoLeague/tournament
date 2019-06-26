'use strict'
const Promise = require('bluebird')
const { Logger } = require('@first-lego-league/ms-logger')

const db = require('../utilities/mongo_connection')
const { MHUB_NODES, publishMsg, subscribe } = require('../utilities/mhub_connection')

const SETTING_COLLECTION_NAME = 'settings'

const logger = new Logger()

subscribe(`tournamentData:deleted`, () => {
  logger.info('Tournament data deleted, resetting stage')
  updateSetting('tournamentStage', 'practice').catch(err => {
    logger.error(`Could not reset tournament stage; ${err.message}`)
  })
})

function setDefaultSettings () {
  const defaultSettings = {
    'tournamentStage': 'practice',
    'tournamentTitle': 'World Festival Houston 2019',
    'numberOfPracticeRounds': 1,
    'numberOfRankingRounds': 3,
    'tournamentCurrentMatch': 0,
    'scheduleTimeOffset': 0
  }

  db.connection()
    .then(connection => {
      return connection.db().collection(SETTING_COLLECTION_NAME)
        .findOne({})
        .then(response => {
          const promises = []
          if (response) {
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
    .catch(err => { throw err })
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
      .findOneAndUpdate({}, { $set: setDocument })
      .then(dbResponse => {
        if (dbResponse.ok === 1) {
          publishMsg(MHUB_NODES.PROTECTED, `${settingName}:updated`, { value })
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

Object.assign(exports, {
  getSetting,
  getAllSettings,
  updateSetting,
  setDefaultSettings,
  getAllStages
})
