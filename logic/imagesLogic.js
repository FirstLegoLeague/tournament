'use strict'

const MsLogger = require('@first-lego-league/ms-logger').Logger()
const path = require('path')
const fs = require('fs-extra')
const {base64, img} = require('base64-img-promise')

const IMAGES_DIR = path.resolve(process.env.DATA_DIR, 'images')
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif']

function initImagesFolder () {
  if (!fs.existsSync(IMAGES_DIR)) {
    MsLogger.info(`Created images folder at: ${IMAGES_DIR}`)
    fs.mkdirSync(IMAGES_DIR)
  }
}

function getAllImagesNames () {
  return fs.readdir(IMAGES_DIR)
}

function getAllImages () {
  return getAllImagesNames().then(names => {
    let namesFilterd = names.filter(filename => ALLOWED_FORMATS.find(x => x == filename.split('.')[1]))
    let images = []
    for (let image of namesFilterd) {
      images.push(createReturnObject(image))
    }
    return Promise.all(images)
  })
}

function getImage (name) {
  return getAllImagesNames().then(images => {
    const image = images.find(x => x === name)
    if (!image) {
      throw new Error('Image does not exists')
    }
    return createReturnObject(image)
  })
}

function saveImageFromBase64 (name, data) {
  return getAllImagesNames().then(images => {
    const image = images.find(x => x === name)
    if (image) {
      throw new Error('Image with that name already exists')
    }
    return img(data, IMAGES_DIR, name)
  })
}

function deleteImage (name) {
  return fs.unlink(path.resolve(IMAGES_DIR, name))
}

function createReturnObject (imageName) {
  return new Promise((resolve) => {
    base64(path.resolve(IMAGES_DIR, imageName)).then(data => {
      let imageData = {
        name: imageName,
        image: data
      }
      resolve(imageData)
    })
  })
}

module.exports = {
  initImagesFolder,
  getAllImages,
  getImage,
  deleteImage,
  saveImageFromBase64
}