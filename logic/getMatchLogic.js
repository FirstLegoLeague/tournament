'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

const { MClient } = require('mhub')

const mhubClient = new MClient(process.env.MHUB_URI)

if (process.env.DEV) {
  mhubClient.login('default', '')
} else {
  mhubClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD)
}

let match = 0
const UPCOMING_MATCHES_TO_GET = 2
let canUpdateMatch = true

mhubClient.connect().then(() => {
  if (process.env.DEV) {
    mhubClient.subscribe('default')
  } else {
    mhubClient.subscribe('protected-client')
  }
})

mhubClient.on('message', msg => {
  switch (msg.topic) {
    case 'clock:start':
      if (canUpdateMatch) {
        match++
        canUpdateMatch = false
      }
      break
    case 'clock:end':
      canUpdateMatch = true
      break
  }
})

function getCurrentMatch () {
  return getMatch(match)
}

function getNextMatches () {
  const retMatches = []

  for (let i = 1; i <= UPCOMING_MATCHES_TO_GET; i++) {
    retMatches.push(getMatch(match + i))
  }

  if (retMatches.length > 0) {
    return retMatches
  }
  return null
}

function getMatchNumber () {
  return match
}

function setMatchNumber (newMatch) {
  match = newMatch
}

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

    return dbMatch
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

module.exports = {
  'getCurrentMatch': getCurrentMatch,
  'getNextMatches': getNextMatches,
  'getMatch': getMatchNumber,
  'setMatch': setMatchNumber
}
