'use strict'
const db = require('../utilities/mongo_connection')
const MsLogger = require('@first-lego-league/ms-logger').Logger()

function getMatch (matchNumber, stage) {
  return db.connect().then(connection => {
    return connection.db().collection('matches').findOne({ 'stage': stage, 'matchId': matchNumber }).then(match => {
      return match
    })
  }).catch(err => {
    MsLogger.error(err)
    return null
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
  isLastMatchInStage
}
