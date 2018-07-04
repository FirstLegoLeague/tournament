const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO

module.exports.deleteValidation = function (params) {
  try {
    deleteMatchesForTeam(parseInt(params.id))
    return true
  } catch (e) {
    return false
  }
}

function deleteMatchesForTeam (teamNumber) {
  MongoClient.connect(MONGU_URI).then(connection => {
    connection.db().collection('matches').find({ 'matchTeams.teamNumber': teamNumber }).toArray().then(data => {
      for (const match of data) {
        for (const matchTeam of match.matchTeams) {
          if (matchTeam.teamNumber == teamNumber) {
            matchTeam.teamNumber = undefined
          }
        }

        connection.db().collection('matches').replaceOne({ _id: match._id }, match).then(dbResponse => {
          if (dbResponse.ok === 1) {
            console.log('OK')
          }
        })
      }

    })
  }).catch(err => {
    MsLogger.error(err)
    throw err
  })
}
