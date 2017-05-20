var fs = require('fs')
var exif = require('exiftool')
var Promise = require('bluebird')
// var path = require('path')
Promise.promisifyAll(exif)
Promise.promisifyAll(fs)

export default {
  run: () => {
    fs.readdirAsync('../public/photos')
      .filter((fileName) => {
        return fileName.match(/\.jpg$|\.jpeg$/)
      })
      .map((fileName) => {
        return fleshOutObject(fileName)
      })
      .then((photos) => {
        console.log(photos)
      })
  }
}

var fleshOutObject = (name) => {
  let path = `../public/photos/${name}`
  let result = getExifData(path)
  return result
}

var getExifData = (path) => {
  return fs.readFileAsync(path)
  .then((data) => {
    return exif.metadataAsync(data)
  }).then((metadata) => {
    var dimensionsArr = splitImageSize(metadata.imageSize)
    return {
      path: path,
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      // imageSize: metadata.imageSize,
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude
    }
  })
}

var splitImageSize = (dimensions) => {
  return dimensions.split('x')
}

exports.default.run()
