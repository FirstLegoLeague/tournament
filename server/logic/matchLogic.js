'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

function getMatch (matchNumber, stage) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection('matches').findOne({ 'stage': stage, 'matchId': matchNumber }).then(match => {
      return match
    })
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

function isLastMatchInStage (matchNumber, stage) {
  getMatch(matchNumber + 1, stage).then(match => {
    if (match) {
      return true
    }
    return false
  })
}

module.exports = {
  getMatch,
  isLastMatchInStage
}
