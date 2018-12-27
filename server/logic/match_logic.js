'use strict'

const MsLogger = require('@first-lego-league/ms-logger').Logger()
const moment = require('moment')

const { getSetting } = require('./settings_logic')

const db = require('../utilities/mongo_connection')

const CURRENT_STAGE_NAME = 'tournamentStage'
const MATCH_COLLECTION = 'matches'

function getMatch (matchNumber, stage) {
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).findOne({
      'stage': stage,
      'matchId': matchNumber
    }).then(match => {
      return convertTimeToToday(match)
    })
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

function getMatchInCurrentStage (matchId) {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getMatch(matchId, stage).then(data => {
      if (data) {
        return convertTimeToToday(data)
      }
      return null
    })
  })
}

function getMatchesByTime (time, amountOfMatches, stage) {
  let stageToQuery = { $exists: true }
  if (stage) {
    stageToQuery = stage
  }
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).find({
      $and: [
        { 'startTime': { $gt: new Date(time) } },
        { 'stage': stageToQuery }
      ]
    }).limit(amountOfMatches).toArray().then(matches => {
      return matches.map(convertTimeToToday)
    })
  })
}

function getMatchForTable (tableId, stage, fromMatch = 0, amount = 1) {
  if (!tableId) {
    throw new Error('Please provide table id')
  }

  if (!stage) {
    throw new Error('Please provide stage')
  }

  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).find({
      $and: [
        { 'matchTeams': { $elemMatch: { 'tableId': tableId, 'teamNumber': { $ne: null } } } },
        { 'matchId': { $gt: fromMatch } },
        { 'stage': stage }
      ]
    }).limit(amount).toArray().then(matches => {
      if (matches.length === 1) {
        return matches[0]
      }
      return matches.map(convertTimeToToday)
    })
  })
}

function isMatchInCurrentStage (matchNumber) {
  return getMatchInCurrentStage(matchNumber).then(match => {
    if (match) {
      return true
    }
    return false
  })
}

module.exports = {
  getMatch,
  isMatchInCurrentStage,
  getMatchesByTime,
  getMatchInCurrentStage,
  getMatchForTable
}

function convertTimeToToday (match) {
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
