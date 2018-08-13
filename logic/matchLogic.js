'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

function getMatch (matchNumber) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    const dbMatch = connection.db().collection('settings').findOne({}).then(tournamentSettings => {
      return connection.db().collection('matches').findOne({ 'stage': tournamentSettings.tournamentStage, 'matchId': matchNumber })
        .then(resolvedMatch => {
          return resolvedMatch
        })
    })

    return dbMatch
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

module.exports = {
  'getMatch': getMatch
}