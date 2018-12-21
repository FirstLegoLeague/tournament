'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const { getSetting } = require('./settings_logic')
const { getMatchesByTime, getMatchInCurrentStage, isMatchInCurrentStage, getMatchForTable } = require('./match_logic')

const { publishUpdateMsg, subscribe } = require('../utilities/mhub_connection')

const Configuration = require('@first-lego-league/ms-configuration')

const CURRENT_STAGE_NAME = 'tournamentStage'
const NEXTUP_MATCHES_AMOUNT_CONFIG_KEY = 'nextupMatchesToShow'
let currentMatchNumber = 0

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
subscribe(`tables:reload`, publishMatchAvailable)
subscribe(`matches:reload`, publishMatchAvailable)
subscribe(`teams:reload`, publishMatchAvailable)

subscribe(`${CURRENT_STAGE_NAME}:updated`, () => {
  setCurrentMatchNumber(0)
    .catch(e => {
      MsLogger.error(e.message)
    })
})

function getCurrentMatch () {
  return getMatchInCurrentStage(currentMatchNumber)
}

function getNextMatches (amountOfMatches) {
  if (currentMatchNumber === 0) { // When there is no match set
    return getSetting(CURRENT_STAGE_NAME).then(stage => {
      return getMatchesByTime(0, amountOfMatches, stage)
    })
  }

  if (currentMatchNumber > 0) {
    return getMatchInCurrentStage(currentMatchNumber).then(match => {
      return getMatchesByTime(match.startTime, amountOfMatches)
    })
  }
}

function getNextMatchForTable (tableId, amountOfMatches = 1) {
  if (!tableId) {
    throw new Error('Please provide table id')
  }

  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getMatchForTable(tableId, stage, currentMatchNumber, amountOfMatches)
  })
}

function publishMatchAvailable () {
  getCurrentMatch().then(match => {
    if (match) {
      publishUpdateMsg('CurrentMatch', match)
    } else {
      return getSetting(CURRENT_STAGE_NAME).then(stage => {
        publishUpdateMsg('CurrentMatch', { matchId: 0, stage: stage, startTime: new Date().get })
      })
    }
  }).catch(error => {
    MsLogger.error(error)
  })

  Configuration.get(NEXTUP_MATCHES_AMOUNT_CONFIG_KEY).then(amount => {
    getNextMatches(amount).then(matches => {
      publishUpdateMsg('UpcomingMatches', matches)
    }).catch(error => {
      MsLogger.error(`Error in "upcoming matches" ${error}`)
    })
  })
}

function getCurrentMatchNumber () {
  return Promise.resolve(currentMatchNumber)
}

function setCurrentMatchNumber (newMatch) {
  return isMatchInCurrentStage(newMatch).then(result => {
    if (result || newMatch === 0) {
      currentMatchNumber = newMatch
      publishMatchAvailable()
      return true
    }

    throw new Error(`Match # ${newMatch} is not in the current stage. could not update`)
  })
}

module.exports = {
  getCurrentMatch,
  getNextMatches,
  getCurrentMatchNumber,
  setCurrentMatchNumber,
  getNextMatchForTable
}
