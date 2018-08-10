'use strict'
const { MClient } = require('mhub')

const mhubClient = new MClient(process.env.MHUB_URI)

const { getMatch } = require('./matchLogic')

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
  return getMatch(match).then(data => {
    if (data) {
      return data
    }
    return null
  })
}

function getNextMatches () {
  const retMatches = []

  for (let i = 1; i <= UPCOMING_MATCHES_TO_GET; i++) {
    retMatches.push(getMatch(match + i).then(data => {
      if (data) {
        return data
      }
      return null
    }))
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

module.exports = {
  'getCurrentMatch': getCurrentMatch,
  'getNextMatches': getNextMatches,
  'getMatch': getMatchNumber,
  'setMatch': setMatchNumber
}
