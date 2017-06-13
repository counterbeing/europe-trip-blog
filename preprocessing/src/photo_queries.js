var fs = require('fs')
var Promise = require('bluebird')
// var mkdirp = Promise.promisify(require('mkdirp'))
Promise.promisifyAll(fs)
import jsonWriter from './json_writer'
// var jsonWriter = require('./json_writer')


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
  return jsonWriter('../public/photos/index.json', metadata)
}

var dateIndex = (metadata) => {
  return Promise.reduce(metadata, (set, item) => {
    set.add(item.dateCreated)
    return set
  }, new Set())
  .map((date) => {
    Promise.filter(metadata, (imageObject) => {
      return imageObject.dateCreated == date
    })
    .then((metadata) => {
      let dir = '../public/photos/' + date
      jsonWriter(dir + '/index.json', metadata)
    })
  })
}
