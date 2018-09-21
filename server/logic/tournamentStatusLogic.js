'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const { getMatch, isLastMatchInStage } = require('./matchLogic')
const { getSetting, updateSetting } = require('./tournamentSettingsLogic')

const { publishUpdateMsg, subscribe } = require('../Utils/mhubConnection')

let currentMatchNumber = 0
const UPCOMING_MATCHES_TO_GET = 2
const CURRENT_STAGE_NAME = 'tournamentStage'

let isLastMatchFinished = true

const practice = 'practice'
const ranking = 'ranking'

const clockStartEvent = function () {
  MsLogger.info('Got clock start event')
  if (isLastMatchFinished) {
    getSetting(CURRENT_STAGE_NAME).then(currentStage => {
      isLastMatchInStage(currentMatchNumber, currentStage).then(result => {
        console.log(result)
        if (result) {
          MsLogger.info('This is the last match in the stage, Advancing stage..')
          if (currentStage === practice) {
            updateSetting(CURRENT_STAGE_NAME, ranking)
            currentMatchNumber = 0
          }
        } else {
          currentMatchNumber++
        }
        publishMatchAvailable()
        isLastMatchFinished = false
      })
    })
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
