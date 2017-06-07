var Promise = require('bluebird')
var fs = require('fs')
var sharp = require('sharp')
var path = require('path')
var mkdirp = Promise.promisify(require('mkdirp'))
var chalk = require('chalk')

Promise.promisifyAll(fs)
Promise.promisifyAll(sharp)

let photosDir = '../public/photos'

let imagePresets = [
  [ 'thumb', 100 ],
  [ 'medium', 800 ],
  [ 'large', 1200],
  [ 'huge', 1600 ]
]

export default (imageObject) => {
  return fs.readFileAsync(imageObject.path)
  .then((imageBuffer) => {
    return promiseAllVersions(imageObject, imageBuffer)
  })
  .then((result) => {
    console.log(chalk.blue(result))
    return 'fuck me right'
  })
  .catch(() => {
    console.log('Image resize failed.')
  })
}

var promiseAllVersions = (imageObject, imageBuffer) => {
  return Promise.all(imagePresets, item => {
    let version = item[0]
    let width   = item[1]
    let outfile = path.join(photosDir, version, imageObject.relativePath)
    return mkdirp(path.dirname(outfile))
    .then(() => {
      console.log(chalk.red(outfile))
      runResize({
        image: imageBuffer,
        outfile: outfile,
        width: width
      })
    })
    .then(() => {
      console.log('Writing version metadata ' + version)
      return 'HERE I AM'
    })
  })
}

var runResize = (config) => {
  return sharp(config.image)
    .resize(config.width)
    .withMetadata()
    .toFile(config.outfile)
    .then(() => {
      // console.log(data)
    })
    .catch((err) => {
      console.log('resizing failed ' + err)
    })
}
