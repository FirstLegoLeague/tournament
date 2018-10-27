'use strict'
const express = require('express')
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const { Logger } = require('@first-lego-league/ms-logger')
const formidable = require('formidable')
const {publishUpdateMsg} = require('../utilities/mhub_connection')

const { getAllImages, getImage, saveImageToImagePath, deleteImage, initImagesFolder } = require('../logic/images_logic')

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

/**
 * A handler for post requests to /images/upload.
 */
router.post('/upload', adminAction, (req, res) => {
  const form = formidable.IncomingForm()
  /*
   * Adding a listener for handling forms with a "file" field.
   * This doesn't assume the name of the input field of the form.
   */
  form.on('file', (field, file) => {
    // this form has a file field.
    // the `path` prop is the local path of the file.
    // the `name` prop is the name of the file.
    const tmpFilePath = file.path
    const imageName = file.name
    saveImageToImagePath(tmpFilePath, imageName).then(() => {
      publishUpdateMsg('images')
      res.status(201).send()
    }).catch(err => {
      res.status(500).send(err.message)
    })
  })
  form.parse(req)
})

router.post('/', adminAction, (req, res) => {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    const tmpFilePath = files.filetoupload.path
    const imageName = files.filetoupload.name

    saveImageToImagePath(tmpFilePath, imageName).then(() => {
      publishUpdateMsg('images')
      res.status(201).send()
    }).catch(err => {
      res.status(500).send(err.message)
    })
  })
})

router.delete('/:imageName', adminAction, (req, res) => {
  deleteImage(req.params.imageName).then(() => {
    publishUpdateMsg('images')
    res.sendStatus(204)
  }).catch(err => {
    logger.error(`An error has occurred ${err}`)
    res.status(500)
    res.send(err.message)
  })
})

module.exports = { imagesRouter: router }
