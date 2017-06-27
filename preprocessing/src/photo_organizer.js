// import photoVersioner from './photo_versioner'
import photoQueries from './photo_queries'
import Photo from './photo'
import fs from 'fs-extra'
// import path from 'path'

var config = require('../config/' + (process.env.NODE_ENV || 'development'))

export default () => {
  fs.readdirAsync(config.photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    return new Photo(fileName)
  })
  // .catch((err) => {
  //   console.log('fuck' + err)
  // })
  // .map((photo) => {
  //   return moveOriginal(photo)
  // })
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
