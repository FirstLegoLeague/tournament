'use strict'
const express = require('express')

const router = express.Router()

router.get('/config', (req, res) => {
  const config = {
    mhubUri: process.env.MHUB_URI,
    mhubNode: process.env.DEV ? 'default' : 'protected'
  }

  res.status(200).send(config)
})

module.exports = router
