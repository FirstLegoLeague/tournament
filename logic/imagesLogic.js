'use strict'

const MsLogger = require('@first-lego-league/ms-logger').Logger()
const path = require('path')
const fs = require('fs-extra')
const { base64, img } = require('base64-img-promise')

const IMAGES_DIR = path.resolve(process.env.DATA_DIR, 'images')
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif']

function initImagesFolder () {
  return fs.exists(IMAGES_DIR).then(exist => {
    if (!exist) {
      const mkdirPromise = fs.mkdir(IMAGES_DIR)
      const copyImagesPromise = fs.copy('default-data/images', IMAGES_DIR)
      return Promise.all([mkdirPromise, copyImagesPromise])
    }
  })
}

function getAllImagesNames () {
  return fs.readdir(IMAGES_DIR)
}

function getAllImages () {
  return getAllImagesNames().then(names => {
    const images = names.filter(filename => ALLOWED_FORMATS.find(x => x == filename.split('.').pop().toLowerCase())).map(createReturnObject)
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

function saveImageToImagePath (imageTempPath, imageName) {
  return getAllImagesNames().then(images => {
    const image = images.find(x => x === imageName)
    if (image) {
      throw new Error('Image with that name already exists')
    }
    return fs.move(imageTempPath, path.resolve(IMAGES_DIR, imageName))
  })
}

function deleteImage (name) {
  return fs.unlink(path.resolve(IMAGES_DIR, name))
}

function createReturnObject (imageName) {
  return new Promise((resolve, reject) => {
    try {
      base64(path.resolve(IMAGES_DIR, imageName)).then(data => {
        const imageData = {
          name: imageName,
          image: data
        }
        resolve(imageData)
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  initImagesFolder,
  getAllImages,
  getImage,
  deleteImage,
  saveImageFromBase64,
  saveImageToImagePath
}
