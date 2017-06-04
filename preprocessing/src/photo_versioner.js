var fs = require('fs')
var Promise = require('bluebird')
var sharp = require('sharp')
var path = require('path')
var mkdirp = Promise.promisify(require('mkdirp'))
Promise.promisifyAll(fs)
Promise.promisifyAll(sharp)

let photosDir = '../public/photos'

let imagePresets = {
  thumb: 100,
  medium: 800,
  large: 1200,
  huge: 1600
}

export default (imageObject) => {
  let versions = { initial: 'fuckeay' }
  return fs.readFileAsync(imageObject.path)
  .then((imageBuffer) => {
    for (let [version, width] of Object.entries(imagePresets)) {
      let outfile = path.join(photosDir, version, imageObject.relativePath)
      mkdirp(path.dirname(outfile))
      .then(() => {
        console.log('Running resize for ' + version)
        runResize({
          image: imageBuffer,
          outfile: outfile,
          width: width
        })
      })
      .then(() => {
        console.log('Writing version metadata ' + version)
        versions[version] = {
          path: outfile
        }
      })
    }
  })
  .then(() => {
    console.log('then versions: ')
    console.log(versions)
    return versions
  })
}

var runResize = (config) => {
  // console.log(config)
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
