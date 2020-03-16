const express = require('express')
const { MongoResourceAdapter } = require('@first-lego-league/synced-resources')
const Promise = require('bluebird')

const { parse } = require('../logic/parse')

const { Team } = require('../../resources/team')
const { Table } = require('../../resources/table')
const { Match } = require('../../resources/match')
const { Status } = require('../../resources/status')
const { Settings } = require('../../resources/settings')

const router = new express.Router()

const saveSchedule = schedule => {
  const teamAdapter = new MongoResourceAdapter(Team)
  const tableAdapter = new MongoResourceAdapter(Table)
  const matchAdapter = new MongoResourceAdapter(Match)
  const settingsAdapter = new MongoResourceAdapter(Settings)
  return Promise.all([
    Promise.all(schedule.teams.map(team => teamAdapter.create(team))),
    Promise.all(schedule.tables.map(table => tableAdapter.create(table))),
    Promise.all(schedule.matches.map(match => matchAdapter.create(match))),
    settingsAdapter.create(schedule.settings)
  ])
}

const deleteSchedule = () => {
  const teamAdapter = new MongoResourceAdapter(Team)
  const tableAdapter = new MongoResourceAdapter(Table)
  const matchAdapter = new MongoResourceAdapter(Match)
  const statusAdapter = new MongoResourceAdapter(Status)
  const settingsAdapter = new MongoResourceAdapter(Settings)
  return Promise.all([
    teamAdapter.deleteAll(),
    tableAdapter.deleteAll(),
    matchAdapter.deleteAll(),
    statusAdapter.deleteAll(),
    settingsAdapter.deleteAll()
  ])
}

router.get((req, res) => {
  res.status(200).send(parse(req.query.data))
    .catch(error => {
      req.logger.error(error)
      res.sendStatus(500)
    })
})

router.post((req, res) => {
  parse(req.body.data)
    .then(schedule => saveSchedule(schedule))
    .then(() => res.sendStatus(201))
    .catch(error => {
      req.logger.error(error)
      res.sendStatus(500)
    })
})

router.delete((req, res) => {
  deleteSchedule()
    .then(() => res.sendStatus(201))
    .catch(error => {
      req.logger.error(error)
      res.sendStatus(500)
    })
})

exports.scheduleRouter = router
