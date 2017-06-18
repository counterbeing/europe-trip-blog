import fs from 'fs-extra'
import exif from 'exiftool'
import snake from 'to-snake-case'
import imghash from 'imghash'
import moment from 'moment'
import Promise from 'bluebird'
import path from 'path'

Promise.promisifyAll(exif)

class Photo {
  constructor(filePath) {
    this.filePath = filePath
  }

  metaData() {
    return Promise.join(
      this.exifData(),
      phashFromFile(this.filePath),
      (exif, phash) => {
        return Object.assign( exif, {phash: phash} )
      }
    )
  }

  phash() {
    return { phash: phashFromFile(this.filePath) }
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
      let dateObject = formatDate(metadata.dateCreated)
      let formattedDate = dateObject.format('YYYY-MM-DD')

      return {
        path: this.filePath,
        relativePath: path.join(snake(metadata.title) + '.jpg'),
        title: metadata.title,
        imageWidth: dimensionsArr[0],
        imageHeight: dimensionsArr[1],
        caption: metadata.imageDescription,
        latitude: metadata.gpsLatitude,
        longitude: metadata.gpsLongitude,
        createdAt: dateObject,
        dateCreated: formattedDate
      }
    })
  }
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
