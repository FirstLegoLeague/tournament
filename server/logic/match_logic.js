'use strict'

const { Logger } = require('@first-lego-league/ms-logger')

const { getSetting } = require('./settings_logic')
const { offsetMatchTime } = require('./object_data_parser')

const { convertMatchTimeToToday } = require('../logic/object_data_parser')

const db = require('../utilities/mongo_connection')

const CURRENT_STAGE_NAME = 'tournamentStage'
const OFFSET_SETTING = 'scheduleTimeOffset'
const MATCH_COLLECTION = 'matches'

const MsLogger = new Logger()

function getMatch (matchNumber, stage) {
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).findOne({
      'stage': stage,
      'matchId': matchNumber
    })
  }).catch(err => {
    MsLogger.error(err)
    return null
  })
}

function getFirstMatchInStage (stage) {
  return db.connect().then(connection => {
    return connection.db().collection(MATCH_COLLECTION).find({
      'stage': stage
    }).sort({ 'startTime': 1 }).limit(1).toArray().then(matches => {
      if (matches.length >= 1) {
        return matches[0]
      }
      return null
    })
  })
}

function getMatchInCurrentStage (matchId) {
  return getSetting(CURRENT_STAGE_NAME).then(stage => {
    return getMatch(matchId, stage).then(data => {
      if (data) {
        return data
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
    }).limit(amountOfMatches).toArray()
  })
}

function getMatchForTable (tableId, stage, fromMatch = 0, amount = 1) {
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
      return matches
    })
  })
}

function isMatchInCurrentStage (matchNumber) {
  return getMatchInCurrentStage(matchNumber).then(match => {
    return Boolean(match)
  })
}

function offsetMatch (match) {
  return getSetting(OFFSET_SETTING).then(offset => {
    return offsetMatchTime(match, offset)
  })
}

function offsetAndConvertToToday (match) {
  return offsetMatch(match).then(newMatch => {
    return convertMatchTimeToToday(newMatch)
  })
}

Object.assign(exports, {
  getMatch,
  isMatchInCurrentStage,
  getMatchesByTime,
  getMatchInCurrentStage,
  getMatchForTable,
  offsetMatch,
  offsetAndConvertToToday,
  getFirstMatchInStage
})
