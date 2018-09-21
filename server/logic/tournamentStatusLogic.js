'use strict'
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const { getMatch, isLastMatchInStage } = require('./matchLogic')
const { getSetting, updateSetting } = require('./tournamentSettingsLogic')
const { getTeamsName } = require('./teamLogic')

const { publishUpdateMsg, subscribe, publishMsg } = require('../Utils/mhubConnection')

let currentMatchNumber = 0
const UPCOMING_MATCHES_TO_GET = 2
const CURRENT_STAGE_NAME = 'tournamentStage'
let canUpdateMatch = true
const practice = 'practice'
const ranking = 'ranking'

const clockStartEvent = function () {
  if (canUpdateMatch) {
    currentMatchNumber++

    publishMatchAvailable()

    canUpdateMatch = false
  }
}

const clockEndEvent = function () {
  canUpdateMatch = true
  if (isLastMatchInStage(currentMatchNumber, getSetting(CURRENT_STAGE_NAME))) {
    if (getSetting(CURRENT_STAGE_NAME) === practice) {
      updateSetting(CURRENT_STAGE_NAME, ranking)
      publishMatchAvailable()
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

async function prepareStatusData (matches) {
  const data = {}
  if (matches.length === 2) {
    let match = matches[0]
    data.nextMatch = match.matchId
    data.nextMatchTime = match.startTime
    const match1Teams = await getTeamsName(match.matchTeams)
    const teamsArr = match1Teams.map(team => {
      return { number: team.number, name: team.name }
    })
    data.nextTeams = teamsArr
    match = matches[1]
    const match2Teams = await getTeamsName(match.matchTeams)
    const teams2Arr = match2Teams.map(team => {
      return { number: team.number, name: team.name }
    })
    data.nextNextTeams = teams2Arr
    console.debug(`\n\nThe Data is \n\n`)
    console.debug(data)
  }
  return data
}

function publishMatchAvailable () {
  getCurrentMatch().then(match => {
    publishUpdateMsg('CurrentMatch', match)
  }).catch(error => {
    MsLogger.error(error)
  })
  getNextMatches().then(matches => {
    publishUpdateMsg('UpcomingMatches', matches)
    sendIt(matches).then(() => console.log('nothing'))
  }).catch(error => {
    MsLogger.error(`Error in "upcoming matches" ${error}`)
  })
}

async function sendIt (matches) {
  const dat = await prepareStatusData(matches)
  publishMsg('default', 'tournament:nextmatch', dat)
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
