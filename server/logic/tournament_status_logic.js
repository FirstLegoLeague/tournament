const Promise = require('bluebird')
const { Logger } = require('@first-lego-league/ms-logger')

const { getSetting, updateSetting } = require('./settings_logic')
const {
  getMatchesByTime, getMatchInCurrentStage, isMatchInCurrentStage,
  getMatchForTable, offsetAndConvertToToday, getFirstMatchInStage
} = require('./match_logic')

const { publishUpdateMsg, subscribe } = require('../utilities/mhub_connection')

const CURRENT_STAGE_NAME = 'tournamentStage'
const CURRENT_MATCH_NAME = 'tournamentCurrentMatch'
const OFFSET_TIME_NAME = 'scheduleTimeOffset'
const AMOUNT_OF_MATCHES_TO_MHUB = 2

const MsLogger = new Logger()
let isLastMatchFinished = true

const clockStartEvent = function () {
  MsLogger.info('Got clock start event')
  if (isLastMatchFinished) {
    isLastMatchFinished = false
    return Promise.resolve()
      .then(() => getCurrentMatchNumber())
      .then(number => {
        if (number === 0) {
          return resetMatchNumberByStage()
        } else {
          return setCurrentMatchNumber(number + 1)
        }
      })
      .then(() => publishMatchAvailable())
      .catch(e => {
        MsLogger.warn(`Error when trying to set the next match number: ${e.message}`)
      })
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
subscribe(`${CURRENT_STAGE_NAME}:updated`, resetMatchNumberByStage)

function resetMatchNumber () {
  MsLogger.info('Resetting current match number to 0')
  return setCurrentMatchNumber(0)
    .catch(e => {
      MsLogger.error(e.message)
    })
}

function resetMatchNumberByStage () {
  return getSetting(CURRENT_STAGE_NAME)
    .then(currStage => {getFirstMatchInStage(currStage)
      MsLogger.info(`resetMatchNumberByStage: currentState ${currStage}`)
    })
    .then(match => {
      MsLogger.info("resetMatchNumberByStage: Match:" + JSON.stringify(match))
      MsLogger.info(`Resetting current match number to ${match.matchId - 1}`)
      return setCurrentMatchNumber(match.matchId - 1)
    })
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
      return getMatchInCurrentStage(currentMatchNumber)
        .then(match => {
          if (match) {
            return getMatchesByTime(match.startTime, amountOfMatches)
          } else {
            return []
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
      return offsetAndConvertToToday(match)
        .then(newMatch => {
          publishUpdateMsg('CurrentMatch', newMatch)
        })
    } else {
      MsLogger.info("publishMatchAvailable: Match:" + JSON.stringify(match))
      return getSetting(CURRENT_STAGE_NAME).then(stage => {
        MsLogger.warn(`Publishing current stage/match ${stage}/0`)
        publishUpdateMsg('CurrentMatch', { matchId: 0, stage: stage, startTime: new Date().getTime() })
      })
    }
  }).catch(error => {
    MsLogger.error(error)
  })

  getNextMatches(AMOUNT_OF_MATCHES_TO_MHUB).then(matches => {
    return Promise.all(matches.map(offsetAndConvertToToday))
      .then(offsetMatches => publishUpdateMsg('UpcomingMatches', offsetMatches))
  }).catch(error => {
    MsLogger.error(`Error in "upcoming matches" ${error}`)
  })
}

function getCurrentMatchNumber () {
  return getSetting(CURRENT_MATCH_NAME)
}

function setCurrentMatchNumber (newMatch) {
  return Promise.all([
    isMatchInCurrentStage(newMatch),
    getSetting(CURRENT_STAGE_NAME)
      .then(currStage => getFirstMatchInStage(currStage))
  ]).then(([matchInCurrentStage, firstMatchInCurrentStage]) => {
    if (matchInCurrentStage || newMatch === firstMatchInCurrentStage.matchId - 1) {
      return updateSetting(CURRENT_MATCH_NAME, newMatch).then(() => {
        publishMatchAvailable()
        return true
      })
    }
    throw new Error(`Match # ${newMatch} is not in the current stage. Cannot update`)
  })
}

Object.assign(exports, {
  getCurrentMatch,
  getNextMatches,
  getCurrentMatchNumber,
  setCurrentMatchNumber,
  getNextMatchForTable
})
