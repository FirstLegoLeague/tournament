const Promise = require('bluebird')
const express = require('express')
const { Logger } = require('@first-lego-league/ms-logger')

const db = require('../utilities/mongo_connection')
const settings = require('../logic/settings_logic')

const RANDOM_ID_LENGTH = 25

const MsLogger = new Logger()

exports.getRouter = function () {
  const router = new express.Router()
  router.get('/:team/matches', (req, res) => {
    db.connection().then(connection => {
      return connection.db().collection('matches')
        .find({ 'matchTeams.teamNumber': parseInt(req.params.team) })
        .sort({ 'stage': 1 })
        .toArray()
        .then(data => {
          if (!data || data.length === 0) {
            return getDefaultStages().then(stages => {
              res.send(getDefaultMatchesForTeam(parseInt(req.params.team), stages))
            })
          }
          res.send(data)
        })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}

function getDefaultMatchesForTeam (teamNumber, stages) {
  const matches = []

  for (const index in stages) {
    for (let i = 1; i <= stages[index].matchAmount; i++) {
      const match = {}
      match._id = createRandomId(RANDOM_ID_LENGTH)
      match.stage = stages[index].stageName
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
      stages.filter(x => x.stageName === 'practice')[0].matchAmount = data[0]
      stages.filter(x => x.stageName === 'ranking')[0].matchAmount = data[1]
      return stages
    })
}

function createRandomId (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
