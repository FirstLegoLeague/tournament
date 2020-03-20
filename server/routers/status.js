const express = require('express')
const { MongoEntityServer } = require('@first-lego-league/synced-resources')

const StatusManager = require('../logic/status')

const { Status } = require('../../resources/status')

StatusManager.init()

const router = new express.Router()

router.use(new MongoEntityServer(Status, { initialValue: Status.initialValue }))

router.get('/next', (req, res) => {
  StatusManager.getNextMatches(req.query.limit, req.query.filters)
    .then(matches => req.status(200).json(matches))
    .catch(error => {
      req.logger.error(error)
      res.sendStatus(500)
    })
})

exports.statusRouter = router
