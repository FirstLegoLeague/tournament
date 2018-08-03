'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

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

  return retMatches
}

const getMatch = function (matchNumber) {
  MongoClient.connect(MONGU_URI).then(connection => {
    const level = connection.db().collection('settings').find({})[0].tournamentLevel
    const dbMatch = connection.db().collection('matches').findOne({ 'matchId': matchNumber }, { 'stage': level })

    if (dbMatch) {
      return {
        'match': dbMatch.matchId,
        'startTime': dbMatch.startTime,
        'endTime': dbMatch.endTime
      }
    }
    return null // happens if match does not exist in DB
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}

module.exports = {
  'getCurrentMatch': getCurrentMatch,
  'getNextMatches': getNextMatches
}
