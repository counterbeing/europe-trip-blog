import photoVersioner from './photo_versioner'

var fs = require('fs')
var exif = require('exiftool')
var Promise = require('bluebird')
var snake = require('to-snake-case')
var moment = require('moment')
var path = require('path')
var mkdirp = Promise.promisify(require('mkdirp'))
var chalk = require('chalk')
// const imghash = require('imghash')
Promise.promisifyAll(exif)
Promise.promisifyAll(fs)

let photosDir = '../public/photos'

export default () => {
  fs.readdirAsync(photosDir)
  .filter((fileName) => {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/)
  })
  .map((fileName) => {
    return fleshOutObject(fileName)
  })
  .map((photo) => {
    return moveOriginal(photo)
  })
  .map((photo) => {
    let res = photoVersioner(photo)
    .then((versions) => {
      console.log(chalk.green(JSON.stringify(versions)))
      photo.versions = versions
      console.log(photo)
      return photo
    })

    console.log('RESULTS')
    console.log(res)
    return res
  })
  .map((photo) => {
    return Promise.props({
      title: photo.title,
      versions: photo.versions
    })
  })
  .then((metadata) => {
    var string = JSON.stringify({'data': metadata}, null, '\t')
    fs.writeFile('../public/photos/index.json', string)
  })
}

var moveOriginal = (photoObject) => {
  let newPath = path.join(photosDir, 'original', photoObject.relativePath)

  return mkdirp(path.dirname(newPath))
    .then(() => {
      fs.rename(photoObject.path, newPath)
    })
    .then(() => {
      photoObject.path = newPath
      return photoObject
    })
  // photoObject.path = newPath
  // return photoObject
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
    let dimensionsArr = splitImageSize(metadata.imageSize)
    let dateObject = formatDate(metadata.dateCreated)
    let formattedDate = dateObject.format('YYYY-MM-DD')

    return {
      path: objectPath,
      relativePath: path.join(formattedDate, snake(metadata.title) + '.jpg'),
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude,
      createdAt: dateObject,
      dateCreated: formattedDate
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

exports.default()
