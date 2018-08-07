'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

const { MClient } = require('mhub')

const mhubClient = new MClient(process.env.MHUB_URI)

const MATCH = 0
const UPCOMING_MATCHES_TO_GET = 2

function getCurrentMatch () {
  return getMatch(MATCH)
}

function getNextMatches () {
  const retMatches = []

  for (let i = 1; i <= UPCOMING_MATCHES_TO_GET; i++) {
    const tempMatch = getMatch(MATCH + i)

    if (tempMatch) {
      retMatches.push(tempMatch)
    } else { // stops if final match is reached/match does not exist in DB
      break
    }
  }

  if (retMatches.length > 0) {
    return retMatches
  }
  return null
}
// TODO: properly handle match not in DB
const getMatch = function (matchNumber) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    const dbMatch = connection.db().collection('settings').findOne({}).then(tournamentSettings => {
      return connection.db().collection('matches').findOne({ 'stage': tournamentSettings.tournamentLevel, 'matchId': matchNumber })
        .then(resolvedMatch => {
          return {
            'match': resolvedMatch.matchId,
            'startTime': resolvedMatch.startTime,
            'endTime': resolvedMatch.endTime
          }
        })
    })

    if (dbMatch) {
      return dbMatch
    } else {
      return null // happens if match does not exist in DB
    }
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

module.exports = {
  'getCurrentMatch': getCurrentMatch,
  'getNextMatches': getNextMatches
}
