var fs = require('fs')
var Promise = require('bluebird')
var sharp = require('sharp')
var path = require('path')
var mkdirp = require('mkdirp')
Promise.promisifyAll(fs)

let photosDir = '../public/photos'

let imagePresets = {
  thumb: 100,
  medium: 800,
  large: 1200,
  huge: 1600
}

export default (imageObject) => {
  let versions = {}
  return fs.readFileAsync(imageObject.path).then((imageBuffer) => {
    for (let [version, width] of Object.entries(imagePresets)) {
      let outfile = path.join(photosDir, version, imageObject.relativePath)
      mkdirp(path.dirname(outfile))
      runResize({
        image: imageBuffer,
        outfile: outfile,
        width: width
      })
      versions[version] = {
        path: outfile
      }
    }
  })
  .then(() => {
    return versions
  })
}

var runResize = (config) => {
  console.log(config)
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
