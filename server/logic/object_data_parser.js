'use strict'
const moment = require('moment')

const Match = require('../models/Match')
const Team = require('../models/Team')
const MatchTeam = require('../models/MatchTeam')

function deserializeMatch (rawMatch, stage) {
  const newMatch = new Match()

  newMatch.matchId = parseIntOrUndefined(rawMatch[0])
  newMatch.startTime = moment(rawMatch[1], 'hh:mm:ss A').set({
    'year': 1970,
    'month': 0,
    'date': 1
  }).toDate()
  newMatch.endTime = moment(rawMatch[2], 'hh:mm:ss A').set({
    'year': 1970,
    'month': 0,
    'date': 1
  }).toDate()
  newMatch.stage = stage
  newMatch.matchTeams = []

  const matchTeamsRaw = rawMatch.slice(3, rawMatch.length)
  for (let i = 0; i < matchTeamsRaw.length; i++) {
    newMatch.matchTeams.push(new MatchTeam(parseFloatOrUndefined(matchTeamsRaw[i]), i))
  }

  return newMatch
}

function deserializeTeam (rawTeam) {
  const newTeam = new Team()

  newTeam.number = parseIntOrUndefined(rawTeam[0])
  newTeam.name = rawTeam[1] || undefined
  newTeam.affiliation = rawTeam[2] || undefined
  newTeam.cityState = rawTeam[3] || undefined
  newTeam.country = rawTeam[4] || undefined
  newTeam.coach1 = rawTeam[5] || undefined
  newTeam.coach2 = rawTeam[6] || undefined
  newTeam.judgingGroup = rawTeam[7] || undefined
  newTeam.pitNumber = parseIntOrUndefined(rawTeam[8])
  newTeam.pitLocation = rawTeam[9] || undefined
  newTeam.translationNeeded = rawTeam[10] == 'true' || undefined

  return newTeam
}

function parseIntOrUndefined (int) {
  return parseInt(int) || undefined
}

function parseFloatOrUndefined (float) {
  return parseFloat(float) || undefined
}

function convertMatchTimeToToday (match) {
  const today = new Date()
  const newMatch = match
  newMatch.startTime = moment(match.startTime).set({
    'year': today.getFullYear(),
    'month': today.getMonth(),
    'date': today.getDate()
  })

  newMatch.endTime = moment(match.endTime).set({
    'year': today.getFullYear(),
    'month': today.getMonth(),
    'date': today.getDate()
  })

  return newMatch
}

module.exports = {
  'deserializeMatch': deserializeMatch,
  'deserializeTeam': deserializeTeam,
  convertMatchTimeToToday
}
