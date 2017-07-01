// Accepts metadata in the form of a massive array of objects
// and then spits out pre filtered json files for any needed
// API endpoint for photos.
import fs from 'fs-extra'
import path from 'path'
import Photo from './photo'
var Promise = require('bluebird')
var config = require('../config/index')

export default {
  run: (metadata) => {
    return Promise.all(
      [
        masterIndex(metadata),
        index(metadata),
        dateIndex(metadata)
      ]
    )
  },

  masterIndex: (metadata) => {
    return masterIndex(metadata)
  },

  dateIndex: (metadata) => {
    return dateIndex(metadata)
  },

  index: (metadata) => {
    return index(metadata)
  }
}

var writeJson = (file, data) => {
  return fs.writeJson(
    file,
    {data: data},
    {spaces: 2}
  )
}

var byCreated = (a, b) => {
  b.attributes['created-at'] - a.attributes['created-at']
}

var masterIndex = (metadata) => {
  let file = path.join(config.photosDir, '/masterIndex.json')
  return fs.writeJson(file, metadata, {spaces: 2})
}

var index = (metadata) => {
  let file = path.join(config.photosDir, '/index.json')
  let photos = metadata.map((data) => {
    let photo = new Photo(data)
    return photo.formatForExport()
  })
  photos = photos.sort(byCreated)
  return writeJson(file, photos)
}

var dateIndex = (metadata) => {
  return Promise.reduce(metadata, (set, item) => {
    set.add(item.dateCreated)
    return set
  }, new Set())
  .map((date) => {
    return Promise.filter(metadata, (imageObject) => {
      return imageObject.dateCreated == date
    })
    .then((metadata) => {
      let file = path.join(config.photosDir, date, '/index.json')
      return writeJson(file, metadata)
    })
  })
}
