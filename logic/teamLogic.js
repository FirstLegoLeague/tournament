'use strict'

const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

exports.deleteValidation = function (params) {
  try {
    return MongoClient().connect(MONGU_URI).then(connection => {
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

exports.editValidation = function (params) {
  return MongoClient().connect(MONGU_URI).then(connection => {
    return connection.db().collection('teams').findOne({ _id: params._id }).then(originalTeam => {
      if (params.number != originalTeam.number) {
        return false
      }
      return true
    })
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}

exports.createValidation = function (params) {
  return MongoClient.connect(MONGU_URI).then(connection => {
    return connection.db().collection('teams').find({ number: params.number }).toArray().then(teams => {
      if (teams.length > 0) {
        return false
      }
      return true
    })
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}

exports.getTeamsName = function (numbers) {
  const actualNumbers = numbers.map(number => number.teamNumber)
  return MongoClient(MONGU_URI).connect().then(connection => {
    return connection.db().collection('teams').find({ number: { $in: actualNumbers } }).toArray()
  }).catch(error => console.error(`Error in "getTeamsName" internal ${error}`))
}

function deleteMatchesForTeam (teamNumber) {
  MongoClient().connect(MONGU_URI).then(connection => {
    return connection.db().collection('matches').updateMany({ 'matchTeams.teamNumber': teamNumber },
      { $set: { 'matchTeams.$.teamNumber': 'null' } }
    )
    // .then(() => connection.close())
  }).then(dbResponse => {
    if (dbResponse.modifiedCount > 0) {
      MsLogger.info('Matches were updates successfully')
    }
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}
