import photoQueries from './photo_queries'
import Photo from './photo'
import fs from 'fs-extra'

var config = require('../config/index')

export default () => {
  loadPhotosIndex()
  processNewPhotos()
}

var processNewPhotos = () => {
  fs.readdirAsync(config.photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    // console.log(fileName)
    return new Photo(config.photosDir + '/' + fileName)
  })
  .map((photo) => {
    return photo.process().then(() => {
      // console.log(photo.metadata)
      return photo.metadata
    })
  })
  .then((metadata) => {
    photoQueries.run(metadata)
  })
}

var loadPhotosIndex = () => {
  // gotta return a promise
}
