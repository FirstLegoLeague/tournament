'use strict'

const { getMatch, isLastMatchInStage } = require('./matchLogic')
const { getSetting, updateSetting } = require('./tournamentSettingsLogic')

const { publishUpdateMsg, subscribe } = require('../Utils/mhubConnection')

let currentMatchNumber = 0
const UPCOMING_MATCHES_TO_GET = 2
const CURRENT_STAGE_NAME = 'tournamentStage'
let canUpdateMatch = true

const clockStartEvent = function () {
  if (canUpdateMatch) {
    currentMatchNumber++

    publishMatchAvilable()

    canUpdateMatch = false
  }
}

const clockEndEvent = function () {
  canUpdateMatch = true
  if (isLastMatchInStage(currentMatchNumber, getSetting(CURRENT_STAGE_NAME))) {
    if (getSetting(CURRENT_STAGE_NAME) === 'practice') {
      updateSetting(CURRENT_STAGE_NAME, 'ranking')
      publishMatchAvilable()
      currentMatchNumber = 0
    }
  }
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

function publishMatchAvilable () {
  getCurrentMatch().then(match => {
    publishUpdateMsg('CurrentMatch', match)
  })
  getNextMatches().then(matches => {
    publishUpdateMsg('UpcomingMatches', matches)
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
