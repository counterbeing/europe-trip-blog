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
    return Promise.all(promisedSizes(imageObject, imageBuffer))
  })
  .then((result) => {
    return Promise.reduce(result, (total, chunk) => {
      let version = chunk.version
      let outfile = chunk.outfile
      total[version] = outfile
      return total
    }, {})
  })
  .catch((error) => {
    console.log(chalk.red('Image resize failed.'))
    console.log(chalk.red(error))
  })
}

var promisedSizes = (imageObject, imageBuffer) => {
  return Promise.map(imagePresets, item => {
    let version = item[0]
    let width   = item[1]
    let outfile = path.join(photosDir, version, imageObject.relativePath)
    return mkdirp(path.dirname(outfile))
    .then(() => {
      runResize({
        image: imageBuffer,
        outfile: outfile,
        width: width
      })
      return { version: version, outfile: outfile }
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
