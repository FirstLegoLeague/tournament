'use strict'

const MsLogger = require('@first-lego-league/ms-logger').Logger()
const path = require('path')
const fs = require('fs')
const { base64Sync, imgSync } = require('base64-img')

const IMAGES_DIR = path.resolve(process.env.DATA_DIR, 'images')
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif']

function initImagesFolder () {
  if (!fs.existsSync(IMAGES_DIR)) {
    MsLogger.info(`Created images folder at: ${IMAGES_DIR}`)
    fs.mkdirSync(IMAGES_DIR)
  }
}

function getAllImagesNames () {
  return new Promise((resolve, reject) => {
    fs.readdir(IMAGES_DIR, (err, data) => {
      if (err) reject(err)
      const images = data.filter(filename => {
        return ALLOWED_FORMATS.find(x => x == filename.split('.')[1])
      })
      resolve(images)
    })
  })
}

function getAllImages () {
  return new Promise((resolve, reject) => {
    getAllImagesNames().then(imagesNames => {
      const images = []
      for (const imageName of imagesNames) {
        images.push(createReturnObject(imageName))
      }
      resolve(images)
    })
  })
}

function getImage (name) {
  return new Promise((resolve, reject) => {
    getAllImagesNames().then(images => {
      const image = images.find(x => x == name)
      if (!image) {
        reject(new Error('Image does not exists'))
      }

      resolve(createReturnObject(image))
    })
  })
}

function saveImageFromBase64 (name, data) {
  return new Promise((resolve, reject) => {
    getAllImagesNames().then(images => {
      const image = images.find(x => x == name)
      if (image) {
        reject(new Error('Image with that name already exists'))
      }
      resolve(imgSync(data, IMAGES_DIR, name))
    })
  })
}

function deleteImage (name) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.resolve(IMAGES_DIR, name), err => {
      if (err) reject(err)
      resolve()
    }
    )
  })
}

function createReturnObject (imageName) {
  return {
    'name': imageName,
    'image': base64Sync(path.resolve(IMAGES_DIR, imageName))
  }
}

module.exports = {
  initImagesFolder,
  getAllImages,
  getImage,
  deleteImage,
  saveImageFromBase64
}
