'use strict'
const express = require('express')
const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const {getAllImages, getImage, saveImageFromBase64, deleteImage} = require('../logic/images')

const adminAction = authroizationMiddlware(['admin', 'development'])

const router = express.Router()

router.get('/all', (req, res) => {
  res.send(getAllImages())
})

router.get('/:imageName', (req, res) => {
  try {
    let image = getImage(req.params.imageName)
    res.send(image)
  } catch (e) {
    res.status(500)
    res.send(e.message)
  }

})

router.post('/', adminAction, (req, res) => {
  try {
    saveImageFromBase64(req.body.imageName, req.body.image)
    res.sendStatus(201)
  } catch (e) {
    res.status(500)
    res.send(e.message)
  }

})

router.delete('/:imageName', adminAction, (req, res) => {
  deleteImage(req.params.imageName)
  res.sendStatus(204)
})

module.exports = {imagesRouter: router}
