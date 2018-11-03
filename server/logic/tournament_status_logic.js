'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const { getMatch } = require('./match_logic')
const { getSetting } = require('./settings_logic')

const { publishUpdateMsg, subscribe } = require('../utilities/mhub_connection')

let currentMatchNumber = 0
const UPCOMING_MATCHES_TO_GET = 2
const CURRENT_STAGE_NAME = 'tournamentStage'

let isLastMatchFinished = true

const clockStartEvent = function () {
  MsLogger.info('Got clock start event')
  if (isLastMatchFinished) {
    currentMatchNumber++
    publishMatchAvailable()
    isLastMatchFinished = false
  }
}

const clockEndEvent = function () {
  MsLogger.info('Got clock end event')
  isLastMatchFinished = true
}

subscribe('clock:start', clockStartEvent)
subscribe('clock:end', clockEndEvent)

function getCurrentMatch () {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getMatch(currentMatchNumber, stage).then(data => {
      if (data) {
        return data
      }
      return null
    })
  })
}

function getNextMatches () {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    const retMatches = []

    for (let i = 1; i <= UPCOMING_MATCHES_TO_GET; i++) {
      retMatches.push(getMatch(currentMatchNumber + i, stage))
    }

    return Promise.all(retMatches)
  })
}

function publishMatchAvailable () {
  getCurrentMatch().then(match => {
    publishUpdateMsg('CurrentMatch', match)
  }).catch(error => {
    MsLogger.error(error)
  })

  getNextMatches().then(matches => {
    publishUpdateMsg('UpcomingMatches', matches)
  }).catch(error => {
    MsLogger.error(`Error in "upcoming matches" ${error}`)
  })
}

function getCurrentMatchNumber () {
  return currentMatchNumber
}

function setCurrentMatchNumber (newMatch) {
  currentMatchNumber = newMatch
}

module.exports = {
  getCurrentMatch,
  getNextMatches,
  getCurrentMatchNumber,
  setCurrentMatchNumber
}
