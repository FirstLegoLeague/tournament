'use strict'
const express = require('express')

const db = require('../utilities/mongo_connection')
const settings = require('../logic/settings_logic')

const MsLogger = require('@first-lego-league/ms-logger').Logger()

const RANDOM_ID_LENGTH = 25

exports.getRouter = function () {
  const router = express.Router()
  router.get('/:team/matches', (req, res) => {
    db.connection().then(connection => {
      connection.db().collection('matches').find({ 'matchTeams.teamNumber': parseInt(req.params.team) }).toArray().then(data => {
        if (!data || data.length === 0) {
          return getDefaultStages().then(stages => {
            res.send(getDefaultMatchesForTeam(parseInt(req.params.team), stages))
          })
        }
        res.send(data)
      })
    }).catch(err => {
      console.log(err)
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}

function getDefaultMatchesForTeam (teamNumber, stages) {
  const matches = []

  for (const stage in stages) {
    for (let i = 1; i <= stages[stage].matchAmount; i++) {
      const match = {}
      match._id = createRandomId(RANDOM_ID_LENGTH)
      match.stage = stages[stage].stageName
      match.matchId = i
      match.matchTeams = [{
        'teamNumber': teamNumber,
        'tableId': null
      }]
      matches.push(match)
    }
  }

  return matches
}

function getDefaultStages () {
  const stages = [
    {
      stageName: 'practice',
      matchAmount: 1
    },
    {
      stageName: 'ranking',
      matchAmount: 3
    }
  ]

  return Promise.all([settings.getSetting('numberOfPracticeRounds'),
    settings.getSetting('numberOfRankingRounds')])
    .then(data => {
      stages.filter(x => x.stageName == 'practice')[0].matchAmount = data[0]
      stages.filter(x => x.stageName == 'ranking')[0].matchAmount = data[1]
      return stages
    })
}

function createRandomId (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
