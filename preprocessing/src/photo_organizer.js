// import photoVersioner from './photo_versioner'
import photoQueries from './photo_queries'
import Photo from './photo'
import fs from 'fs-extra'
import path from 'path'

var config = require('../config/' + (process.env.NODE_ENV || 'development'))

export default () => {
  fs.readdirAsync(config.photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    return new Photo(fileName)
  })
  .map((photo) => {
    return moveOriginal(photo)
  })
  .map((photo) => {
    photo.process()
    return photo.metadata
  })
  .then((metadata) => {
    photoQueries.run(metadata)
  })
}

var moveOriginal = (photoObject) => {
  let newPath = path.join(
    config.photosDir,
    photoObject.dateCreated,
    'original',
    photoObject.relativePath
  )

  return fs.mkdirp(path.dirname(newPath))
    .then(() => {
      fs.rename(photoObject.path, newPath)
    })
    .then(() => {
      photoObject.path = newPath
      return photoObject
    })
}

exports.default()
