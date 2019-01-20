'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const {getSetting, updateSetting} = require('./settings_logic')
const {getMatchesByTime, getMatchInCurrentStage, isMatchInCurrentStage, getMatchForTable, offsetAndConvertToToday, getFirstMatchInStage} = require('./match_logic')

const {publishUpdateMsg, subscribe} = require('../utilities/mhub_connection')

const CURRENT_STAGE_NAME = 'tournamentStage'
const CURRENT_MATCH_NAME = 'tournamentCurrentMatch'
const OFFSET_TIME_NAME = 'scheduleTimeOffset'
const AMOUNT_OF_MATCHES_TO_MHUB = 2

let isLastMatchFinished = true

const clockStartEvent = function () {
  MsLogger.info('Got clock start event')
  if (isLastMatchFinished) {
    try {
      getCurrentMatchNumber().then(number => {
        if (number === 0) {
          getSetting(CURRENT_STAGE_NAME).then(currStage => {
            getFirstMatchInStage(currStage).then(match => {
              setCurrentMatchNumber(match.matchId).then(() => {
                publishMatchAvailable()
              })
            })
          })
        } else {
          setCurrentMatchNumber(number + 1).then(() => {
            publishMatchAvailable()
          })
        }
      })
    } catch (e) {
      MsLogger.warn(`Error when trying to set the next match number: ${e.message}`)
    }
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
subscribe(`${OFFSET_TIME_NAME}:updated`, publishMatchAvailable)

subscribe(`teams:reload`, publishMatchAvailable)
subscribe(`tournamentData:deleted`, resetMatchNumber)
subscribe(`${CURRENT_STAGE_NAME}:updated`, resetMatchNumber)

function resetMatchNumber () {
  MsLogger.info('Resetting current match number to 0')
  return setCurrentMatchNumber(0)
    .catch(e => {
      MsLogger.error(e.message)
    })
}

function getCurrentMatch () {
  return getCurrentMatchNumber().then(number => {
    return getMatchInCurrentStage(number)
  })
}

function getNextMatches (amountOfMatches) {
  if (amountOfMatches === 0) {
    return Promise.resolve([])
  }

  return getCurrentMatchNumber().then(currentMatchNumber => {
    if (currentMatchNumber === 0) { // When there is no match set
      return getSetting(CURRENT_STAGE_NAME).then(stage => {
        return getMatchesByTime(0, amountOfMatches, stage)
      })
    }

    if (currentMatchNumber > 0) {
      return getMatchInCurrentStage(currentMatchNumber).then(match => {
        if (match) {
          return getMatchesByTime(match.startTime, amountOfMatches)
        } else {
          return Promise.resolve([])
        }
      })
    }
  })
}

function getNextMatchForTable (tableId, amountOfMatches = 1) {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getCurrentMatchNumber().then(currentMatchNumber => {
      return getMatchForTable(tableId, stage, currentMatchNumber, amountOfMatches)
    })
  })
}

function publishMatchAvailable () {
  getCurrentMatch().then(match => {
    if (match) {
      offsetAndConvertToToday(match).then(newMatch => {
        publishUpdateMsg('CurrentMatch', newMatch)
      })
    } else {
      return getSetting(CURRENT_STAGE_NAME).then(stage => {
        publishUpdateMsg('CurrentMatch', {matchId: 0, stage: stage, startTime: new Date().getTime()})
      })
    }
  }).catch(error => {
    MsLogger.error(error)
  })

  getNextMatches(AMOUNT_OF_MATCHES_TO_MHUB).then(matches => {
    Promise.all(matches.map(offsetAndConvertToToday)).then(offsetMatches => {
      publishUpdateMsg('UpcomingMatches', offsetMatches)
    })
  }).catch(error => {
    MsLogger.error(`Error in "upcoming matches" ${error}`)
  })
}

function getCurrentMatchNumber () {
  return getSetting(CURRENT_MATCH_NAME)
}

function setCurrentMatchNumber (newMatch) {
  return isMatchInCurrentStage(newMatch).then(result => {
    if (result || newMatch === 0) {
      return updateSetting(CURRENT_MATCH_NAME, newMatch).then(() => {
        publishMatchAvailable()
        return true
      })
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
