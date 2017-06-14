var fs = require('fs')
var Promise = require('bluebird')
var mkdirp = Promise.promisify(require('mkdirp'))
var path = require('path')
Promise.promisifyAll(fs)

var run = (filePath, object) => {
  let string = JSON.stringify({'data': object}, null, '\t')
  let dir = path.dirname(filePath)
  return mkdirp(dir).then(() => {
    fs.writeFile(filePath, string)
  }).catch((reason) => {
    console.log('Failed to write json file: ' + reason)
  })
}

module.exports = { run: run }
