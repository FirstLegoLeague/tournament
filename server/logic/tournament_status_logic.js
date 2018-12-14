'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const {getMatchesByTime, getMatchInCurrentStage} = require('./match_logic')

const {publishUpdateMsg, subscribe} = require('../utilities/mhub_connection')

let currentMatchNumber = 0
const UPCOMING_MATCHES_TO_GET = 2

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
  return getMatchInCurrentStage(currentMatchNumber)
}

function getNextMatches () {
  let matchToGet = currentMatchNumber === 0 ? currentMatchNumber + 1 : currentMatchNumber
  return getMatchInCurrentStage(matchToGet).then(match => {
    return getMatchesByTime(match.startTime, UPCOMING_MATCHES_TO_GET)
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
