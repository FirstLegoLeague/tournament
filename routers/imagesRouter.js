'use strict'
const express = require('express')
const {authroizationMiddlware} = require('@first-lego-league/ms-auth')

const {getAllImages, getImage, saveImageFromBase64, deleteImage, initImagesFolder} = require('../logic/imagesLogic')

const adminAction = authroizationMiddlware(['admin', 'development'])

const router = express.Router()

initImagesFolder()


router.get('/all', (req, res) => {
  getAllImages().then(images => {
    res.send(images)
  }).catch(err => {
    res.status(500)
    res.send(err.message)
  })
})

router.get('/:imageName', (req, res) => {
  getImage(req.params.imageName).then(image => {
    res.send(image)
  }).catch(err => {
    res.status(500)
    res.send(err.message)
  })
})

router.post('/', adminAction, (req, res) => {
  saveImageFromBase64(req.body.name, req.body.image).then(() => {
    res.sendStatus(201)
  }).catch(e => {
    res.status(500)
    res.send(e.message)
  })
})

router.delete('/:imageName', adminAction, (req, res) => {
  deleteImage(req.params.imageName).then(() => {
    res.sendStatus(204)
  }).catch(err => {
    res.status(500)
    res.send(err.message)
  })
})

module.exports = {imagesRouter: router}