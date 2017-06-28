import photoQueries from './photo_queries'
import Photo from './photo'
import fs from 'fs-extra'
import path from 'path'

var config = require('../config/index')

export default () => {
  return loadPhotosIndex().then((existingPhotos) => {
    return processNewPhotos(existingPhotos)
  })
}

var processNewPhotos = (existingPhotos) => {
  return fs.readdirAsync(config.photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    let file = path.join(config.photosDir + '/' + fileName)
    return new Photo(file)
  })
  .map((photo) => {
    return photo.process().then(() => {
      return photo.metadata
    })
  })
  .then((metadata) => {
    return [...metadata, ...existingPhotos]
  })
  .then((allMetadata) => {
    return photoQueries.run(allMetadata)
  })
}

var loadPhotosIndex = () => {
  return fs.readJson(path.join(config.photosDir, 'index.json'))
}
