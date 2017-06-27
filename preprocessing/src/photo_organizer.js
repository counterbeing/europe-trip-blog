import photoQueries from './photo_queries'
import Photo from './photo'
import fs from 'fs-extra'

var config = require('../config/index')

export default () => {
  processNewPhotos()
}

var processNewPhotos = () => {
  fs.readdirAsync(config.photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    return new Photo(fileName)
  })
  .map((photo) => {
    photo.process()
    console.log(photo.metadata)
    return photo.metadata
  })
  .then((metadata) => {
    // console.log(metadata)
    photoQueries.run(metadata)
  })
}

exports.default()
