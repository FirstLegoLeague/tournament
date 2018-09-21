'use strict'
const express = require('express')
const db = require('../Utils/mongoConnection')
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const RANDOM_ID_LENGTH = 25

exports.getRouter = function () {
  const router = express.Router()
  router.get('/:team/matches', (req, res) => {
    db.connection().then(connection => {
      connection.db().collection('matches').find({ 'matchTeams.teamNumber': parseInt(req.params.team) }).toArray().then(data => {
        if (!data || data.length === 0) {
          res.send(getDefaultMatchesForTeam(parseInt(req.params.team)))
          return
        }

        res.send(data)
        connection.close()
      })
    }).catch(err => {
      console.log(err)
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}

function getDefaultMatchesForTeam (teamNumber) {
  const practice = {
    '_id': createRandomId(RANDOM_ID_LENGTH),
    'matchId': 1,
    'stage': 'practice',
    'matchTeams': [
      {
        'teamNumber': teamNumber,
        'tableId': null
      }
    ]
  }

  const ranking = {
    '_id': createRandomId(RANDOM_ID_LENGTH),
    'matchId': 1,
    'stage': 'ranking',
    'matchTeams': [
      {
        'teamNumber': teamNumber,
        'tableId': null
      }
    ]
  }

  let matches = []
  matches.push(practice)

  for (let i = 1; i <= 3; i++) {
    let match = {}
    match._id = createRandomId(RANDOM_ID_LENGTH)
    match.matchId = i
    match.stage = ranking.stage
    match.matchTeams = ranking.matchTeams
    matches.push(match)
  }

  return matches
}

function createRandomId (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
