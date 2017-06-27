// Accepts metadata in the form of a massive array of objects
// and then spits out pre filtered json files for any needed
// API endpoint for photos.
import fs from 'fs-extra'
var Promise = require('bluebird')
var config = require('../config/index')

export default {
  run: (metadata) => {
    return Promise.all(
      [
        masterIndex(metadata),
        dateIndex(metadata)
      ]
    )
  },

  masterIndex: (metadata) => {
    return masterIndex(metadata)
  },

  dateIndex: (metadata) => {
    return dateIndex(metadata)
  }
}

var masterIndex = (metadata) => {
  return fs.writeJson(config.photosDir, metadata, {spaces: 2})
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
      let file = config.photosDir + date + '/index.json'
      return fs.writeJson(file, metadata, {spaces: 2})
    })
  })
}
