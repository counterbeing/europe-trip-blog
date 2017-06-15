var fs = require('fs')
var Promise = require('bluebird')
Promise.promisifyAll(fs)
import jsonWriter from './json_writer'

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
  return jsonWriter.run('../public/photos/index.json', metadata)
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
      let dir = '../public/photos/' + date
      return jsonWriter.run(dir + '/index.json', metadata)
    })
  })
}
