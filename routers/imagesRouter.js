'use strict'
const express = require('express')
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const { Logger } = require('@first-lego-league/ms-logger')
const formidable = require('formidable')

const { getAllImages, getImage, saveImageToImagePath, deleteImage, initImagesFolder } = require('../logic/imagesLogic')

const adminAction = authroizationMiddlware(['admin', 'development'])
const logger = Logger()
const router = express.Router()

initImagesFolder().catch(err => {
  logger.error(`Could not init image folder: ${err}`)
})

router.get('/all', (req, res) => {
  getAllImages().then(images => {
    res.send(images)
  }).catch(err => {
    logger.error(`An error has occurred ${err}`)
    res.status(500)
    res.send(err.message)
  })
})

router.get('/:imageName', (req, res) => {
  getImage(req.params.imageName).then(image => {
    res.send(image)
  }).catch(err => {
    logger.error(`An error has occurred ${err}`)
    res.status(500)
    res.send(err.message)
  })
})

router.post('/', adminAction, (req, res) => {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const tmpFilePath = files.filetoupload.path
    const imageName = files.filetoupload.name

    saveImageToImagePath(tmpFilePath, imageName).then(() => {
      res.status(201).send()
    }).catch(err => {
      res.status(500).send(err.message)
    })
  })
})

router.delete('/:imageName', adminAction, (req, res) => {
  deleteImage(req.params.imageName).then(() => {
    res.sendStatus(204)
  }).catch(err => {
    logger.error(`An error has occurred ${err}`)
    res.status(500)
    res.send(err.message)
  })
})

module.exports = { imagesRouter: router }
