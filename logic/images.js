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
  return fs.readdirSync(IMAGES_DIR).filter(filename => {
    return ALLOWED_FORMATS.find(x => x == filename.split('.')[1])
  })
}

function getAllImages () {
  const imagesNames = getAllImagesNames()
  const images = []
  for (const imageName of imagesNames) {
    const image = {}
    image['name'] = imageName
    image['image'] = base64Sync(path.resolve(IMAGES_DIR, imageName))
    images.push(image)
  }
  return images
}

function getImage (name) {
  const image = getAllImagesNames().find(x => x == name)
  if (!image) {
    MsLogger.error(`trying to get image ${name} but it does not exists`)
    throw 'Image does not exists'
  }

  return {
    'name': image,
    'image': base64Sync(path.resolve(IMAGES_DIR, image))
  }
}

function saveImageFromBase64 (name, data) {
  const image = getAllImagesNames().find(x => x == name)
  if (image) {
    throw 'Image with that name already exists'
  }
  imgSync(data, IMAGES_DIR, name)
  MsLogger.info(`Saved a new image at: ${IMAGES_DIR} with name ${name}`)
}

function deleteImage (name) {
  fs.unlinkSync(path.resolve(IMAGES_DIR, name))
}

module.exports = {
  initImagesFolder,
  getAllImages,
  getImage,
  deleteImage,
  saveImageFromBase64
}
