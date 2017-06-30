import fs from 'fs-extra'
import exif from 'exiftool'
import paramCase from 'param-case'
import imghash from 'imghash'
import moment from 'moment'
import Promise from 'bluebird'
import path from 'path'
import geolib from 'geolib'
import uuid from 'uuid/v4'
import photoVersioner from './photo_versioner'
var config = require('../config/index')

Promise.promisifyAll(exif)

class Photo {
  constructor(arg) {
    if(!arg.title) {
      this.filePath = arg
    } else {
      this.metadata = arg
      this.processed = true
    }
  }

  extractData() {
    return Promise.join(
      this.exifData(),
      phashFromFile(this.filePath),
      (exif, phash) => {
        this.metadata = Object.assign(exif, {phash: phash} )
      }
    )
  }

  pathToVersion(version) {
    return path.join(
      config.photosDir,
      this.metadata.dateCreated,
      version,
      this.metadata.relativePath
    )
  }

  process() {
    let photo = this
    return photo.extractData()
    .then(() => {
      return moveOriginal(photo)
    })
    .then(() => {
      photo.processed = true
      return photoVersioner(photo)
    })
  }

  formatForExport() {
    if(!this.metadata){
      console.log(this)
    }
    return {
      type: 'photo',
      id: this.metadata.uuid,
      attributes: {
        filename: this.metadata.relativePath,
        title: this.metadata.title,
        caption: this.metadata.caption,
        latitude: this.metadata.latitude,
        longitude: this.metadata.longitude,
        'created-at': this.metadata.createdAt,
        'date-created': this.metadata.dateCreated,
      }
    }
  }

  exifData() {
    if(this.storedExifData) {
      return this.storedExifData
    }

    return fs.readFileAsync(this.filePath)
    .then((data) => {
      return exif.metadataAsync(data)
    })
    .then((metadata) => {
      let dimensionsArr = splitImageSize(metadata.imageSize)
      let dateObject = formatDate(metadata.dateCreated || metadata.createDate)
      let formattedDate = dateObject.format('YYYY-MM-DD')

      console.log('processing: ' + metadata.title)
      return {
        relativePath: path.join(paramCase(metadata.title) + '.jpg'),
        uuid: uuid(),
        title: metadata.title,
        imageWidth: dimensionsArr[0],
        imageHeight: dimensionsArr[1],
        caption: metadata.imageDescription,
        latitude: convertGPS(metadata.gpsLatitude),
        longitude: convertGPS(metadata.gpsLongitude),
        createdAt: dateObject,
        dateCreated: formattedDate
      }
    })
  }
}

var convertGPS = (coordinate) => {
  if(!coordinate) { return null }
  let sex = coordinate.replace(' deg', '°')
  return geolib.sexagesimal2decimal(sex)
}

var moveOriginal = (photoObject) => {
  let newPath = photoObject.pathToVersion('original')
  return fs.move(photoObject.filePath, newPath).then(() => {
    photoObject.filePath = newPath
  })
}

var formatDate = (exifDateString) => {
  return moment(exifDateString, 'YYYY:MM:DD HH:mm:SS')
}

var phashFromFile = (path) => {
  return imghash.hash(path)
}

var splitImageSize = (dimensions) => {
  return dimensions.split('x')
}

export default Photo
