const express = require('express')

const router = new express.Router()

router.get('/config', (req, res) => {
  const config = {
    mhubUri: process.env.MHUB_URI
  }

  res.status(200).send(config)
})

exports.configRouter = router
