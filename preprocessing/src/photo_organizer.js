var fs = require('fs')
var exif = require('exiftool')
var Promise = require('bluebird')
var snake = require('to-snake-case')
var moment = require('moment')
var path = require('path')
// const imghash = require('imghash')
// var path = require('path')
Promise.promisifyAll(exif)
Promise.promisifyAll(fs)

let photosDir = '../public/photos'

export default {
  run: () => {
    fs.readdirAsync(photosDir)
      .filter((fileName) => {
        return fileName.match(/\.jpg$|\.jpeg$/)
      })
      .map((fileName) => {
        return fleshOutObject(fileName)
      })
      .map((photo) => {
        console.log(photo)
        movePhoto(photo)
      })
  }
}

var movePhoto = (photoObject) => {
  let date = photoObject.dateCreated.format('YYYY-MM-DD')
  let dateFolder = path.join(photosDir, date)
  let newPath = newPhotoPath(photoObject, date)
  console.log('checking for dir')
  fs.statAsync(dateFolder)
    .then(null, () => {
      fs.mkdir(dateFolder)
    })
    .then(() => {
      console.log('running rename of ' + photoObject.path)
      fs.rename(photoObject.path, newPath)
    })
}

var newPhotoPath = (photoObject, date) => {
  let title = snake(photoObject.title)
  return path.join(photosDir, date, title + '.jpg')
}

var fleshOutObject = (name) => {
  let objectPath = path.join(photosDir, name)
  let result = getExifData(objectPath)
  return result
}

var getExifData = (objectPath) => {
  return fs.readFileAsync(objectPath)
  .then((data) => {
    return exif.metadataAsync(data)
  })
  .then((metadata) => {
    var dimensionsArr = splitImageSize(metadata.imageSize)
    // console.log(metadata)
    return {
      path: objectPath,
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude,
      dateCreated: formatDate(metadata.dateCreated)
      // phash: phashFromFile(path)
    }
  })
}

var formatDate = (exifDateString) => {
  return moment(exifDateString, 'YYYY:MM:DD HH:mm:SS')
}

// var phashFromFile = (path) => {
//   return imghash.hash(path)
// }

var splitImageSize = (dimensions) => {
  return dimensions.split('x')
}

exports.default.run()
