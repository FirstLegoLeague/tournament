'use strict'

const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

exports.deleteValidation = function (params) {
  try {
    return MongoClient.connect(MONGU_URI).then(connection => {
      return connection.db().collection('teams').findOne({ _id: params.id }).then(team => {
        if (team) {
          deleteMatchesForTeam(team.number)
        }
      })
    })
  } catch (e) {
    MsLogger.error(e)
    return false
  }
}

function deleteMatchesForTeam (teamNumber) {
  MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection('matches').updateMany({ 'matchTeams.teamNumber': teamNumber },
      { $set: { 'matchTeams.$.teamNumber': 'null' } }
    )
  }).then(dbResponse => {
    if (dbResponse.modifiedCount > 0) {
      MsLogger.info('Matches were updates successfully')
    }
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}
