'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const {getAllImages, getImage, saveImageFromBase64, deleteImage} = require('../logic/images')

const adminAction = authroizationMiddlware(['admin', 'development'])

const router = express.Router()

router.get('/all', (req, res) => {
  res.send(getAllImages())
})

router.get('/:imageName', (req, res) => {
  res.send(getImage(req.params.imageName))
})

router.post('/', (req, res) => {
  saveImageFromBase64(req.body.imageName, req.body.image)
  res.sendStatus(201)
})

router.delete('/:imageName', (req, res) => {
  deleteImage(req.params.imageName)
  res.sendStatus(204)
})

module.exports = {imagesRouter: router}
