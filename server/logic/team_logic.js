'use strict'
const ObjectId = require('mongodb').ObjectID

const { Logger } = require('@first-lego-league/ms-logger')
const requestify = require('requestify')

const db = require('../utilities/mongo_connection')

const MsLogger = new Logger()

exports.deleteValidation = function (params) {
  return db.connection().then(connection => {
    return connection.db().collection('teams').findOne({ _id: new ObjectId(params.id) }).then(team => {
      if (team) {
        return deleteMatchesForTeam(team.number)
      }
    })
  })
}

exports.editValidation = function (params) {
  return db.connection().then(connection => {
    return connection.db().collection('teams').findOne({ _id: params._id }).then(originalTeam => {
      return params.number === originalTeam.number
    })
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}

exports.createValidation = function (params) {
  return db.connection()
    .then(connection => {
      return connection.db().collection('teams')
        .find({ number: params.number })
        .toArray()
        .then(teams => {
          return teams.length <= 0
        })
    })
    .catch(err => {
      MsLogger.error(err)
      throw err
    })
}

exports.getTeamsName = function (numbers) {
  const actualNumbers = numbers.map(number => number.teamNumber)
  return db.connection().then(connection => {
    return connection.db().collection('teams').find({ number: { $in: actualNumbers } }).toArray()
  }).catch(error => console.error(`Error in "getTeamsName" internal ${error}`))
}

function deleteMatchesForTeam (teamNumber) {
  return requestify.get(`${process.env.MODULE_SCORING_URL}/scores/search?teamNumber=${teamNumber}`).then(response => {
    if (response.body !== '[]') {
      return new Error('This team has scores. Please delete them and try again')
    }
    if (!process.env.DEV && !response.body) {
      return db.connection().then(connection => {
        return connection.db().collection('matches').updateMany({ 'matchTeams.teamNumber': teamNumber },
          { $set: { 'matchTeams.$.teamNumber': null } }
        )
      }).then(dbResponse => {
        if (dbResponse.modifiedCount > 0) {
          MsLogger.info(`Matches were updates successfully without team ${teamNumber}`)
        }
      }).catch(err => {
        MsLogger.error(err)
        return err
      })
    }
  }).catch(err => {
    MsLogger.error(err)
    return err
  })
}
