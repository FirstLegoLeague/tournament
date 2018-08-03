'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

const match = 0

function getCurrentMatch () {

}

const getMatch = function (matchNumber) {
  MongoClient.connect(MONGU_URI).then(connection => {
    const level = connection.db().collection('settings').find({})[0].tournamentLevel
    const dbMatch = connection.db().collection('matches').findOne({ 'matchId': match }, { 'stage': level })

    if (dbMatch) {
      return {
        'match': dbMatch.matchId,
        'startTime': dbMatch.startTime,
        'endTime': dbMatch.endTime
      }
    }
    return null // happens if match does not exist in DB
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}
