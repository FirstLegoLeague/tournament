const Promise = require('bluebird')
const path = require('path')
const fs = require('fs-extra')
const { base64, img } = require('base64-img-promise')

const IMAGES_DIR = path.resolve(process.env.DATA_DIR, 'images')
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif']

function initImagesFolder () {
  return fs.exists(IMAGES_DIR).then(exist => {
    if (!exist) {
      return fs.mkdir(IMAGES_DIR)
    }
  }).then(() => {
    return Promise.all(['local', 'global'].map(subdir => {
      const subdirPath = path.resolve(IMAGES_DIR, subdir)
      return fs.exists(subdirPath).then(subdirExists => {
        if (!subdirExists) {
          const mkdirPromise = fs.mkdir(subdirPath)
          const copyImagesPromise = fs.copy(`default-data/images/${subdir}`, subdirPath)
          return Promise.all([mkdirPromise, copyImagesPromise])
        }
      })
    }))
  })
}

function getGlobalImagesPaths () {
  return fs.readdir(path.resolve(IMAGES_DIR, 'global'))
    .then(images => images.map(image => `global/${image}`))
}

function getLocalImagesPaths () {
  return fs.readdir(path.resolve(IMAGES_DIR, 'local'))
    .then(images => images.map(image => `local/${image}`))
}

function getAllImagesPaths () {
  return Promise.all([getGlobalImagesPaths(), getLocalImagesPaths()])
    .then(([globalImages, localImages]) => {
      return []
        .concat(globalImages)
        .concat(localImages)
    })
}

function getImagesFromPaths (imagesPaths) {
  return Promise.all(imagesPaths
    .filter(imagePath => ALLOWED_FORMATS.find(x => x === imagePath.split('.').pop().toLowerCase()))
    .map(createReturnObject))
}

function getGlobalImages () {
  return getGlobalImagesPaths().then(getImagesFromPaths)
}

function getLocalImages () {
  return getLocalImagesPaths().then(getImagesFromPaths)
}

function getAllImages () {
  return Promise.all([getGlobalImages(), getLocalImages()])
    .then(([global, local]) => ({ global, local }))
}

function validateImageExistance (imagePath, shouldExist = true) {
  return getAllImagesPaths().then(images => {
    const image = images.find(x => x === imagePath)
    if (Boolean(image) !== shouldExist) {
      throw new Error(`Image ${shouldExist ? 'does not' : 'already'} exists`)
    }
    return image
  })
}

function getImage (imagePath) {
  return validateImageExistance(imagePath)
    .then(createReturnObject)
}

function saveImageFromBase64 (imagePath, data) {
  return validateImageExistance(imagePath, false)
    .then(() => img(data, IMAGES_DIR, imagePath))
}

function saveImageToImagePath (imageTempPath, imageName) {
  const imagePath = `local/${imageName}`
  return validateImageExistance(imagePath, false)
    .then(image => fs.move(imageTempPath, path.resolve(IMAGES_DIR, imagePath)))
}

function deleteImage (imageName) {
  return fs.unlink(path.resolve(IMAGES_DIR, 'local', imageName))
}

function createReturnObject (imagePath) {
  return Promise.try(() => base64(path.resolve(IMAGES_DIR, imagePath)))
    .then(data => {
      return {
        name: imagePath.split('/').slice(-1)[0],
        image: data
      }
    })
}

Object.assign(exports, {
  initImagesFolder,
  getLocalImages,
  getGlobalImages,
  getAllImages,
  getImage,
  deleteImage,
  saveImageFromBase64,
  saveImageToImagePath
})
