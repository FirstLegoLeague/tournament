'use strict'
const db = require('../utilities/mongo_connection')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const {getSetting} = require('./settings_logic')

const CURRENT_STAGE_NAME = 'tournamentStage'
const MATCH_COLLECTION = 'matches'

function getMatch (matchNumber, stage) {
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).findOne({
      'stage': stage,
      'matchId': matchNumber
    }).then(match => {
      return match
    })
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

function getMatchInCurrentStage (matchId) {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getMatch(matchId, stage).then(data => {
      if (data) {
        return data
      }
      return null
    })
  })
}

function getMatchesByTime (time, amountOfMatches) {
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).find({'startTime': {$gt: time}}).limit(amountOfMatches).toArray()
  })
}

function isLastMatchInStage (matchNumber, stage) {
  return getMatch(matchNumber + 1, stage).then(match => {
    if (match) {
      return false
    }
    return true
  })
}

module.exports = {
  getMatch,
  isLastMatchInStage,
  getMatchesByTime,
  getMatchInCurrentStage
}
