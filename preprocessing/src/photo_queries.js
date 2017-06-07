var fs = require('fs')
var Promise = require('bluebird')
var mkdirp = Promise.promisify(require('mkdirp'))
Promise.promisifyAll(fs)


export default(metadata) => {
  masterIndex(metadata)
  dateIndex(metadata)
}

var masterIndex = (metadata) => {
  var string = JSON.stringify({'data': metadata}, null, '\t')
  fs.writeFile('../public/photos/index.json', string)
}

var dateIndex = (metadata) => {
  Promise.reduce(metadata, (set, item) => {
    set.add(item.dateCreated)
    return set
  }, new Set())
  .map((date) => {
    Promise.filter(metadata, (imageObject) => {
      return imageObject.dateCreated == date
    })
    .then((metadata) => {
      let dir = '../public/photos/' + date
      let string = JSON.stringify({'data': metadata}, null, '\t')
      mkdirp(dir).then(() => {
        fs.writeFile(dir + '/index.json', string)
      })
    })
  })
}
