const express = require('express')

const Configuration = require('@first-lego-league/ms-configuration')

const router = new express.Router()

router.get('/', (req, res) => {
  Configuration.all().then(config => {
    Object.assign(config, {
      mhub: process.env.MHUB_URI
    })
    res.json(config)
  }).catch(err => {
    req.logger.error(err.message)
    res.status(500).send('Could not load configuration')
  })
})

exports.configRouter = router
