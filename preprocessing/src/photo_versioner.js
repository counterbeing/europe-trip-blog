import Promise from 'bluebird'
import fs from 'fs-extra'
import sharp from 'sharp'
import path from 'path'
import chalk from 'chalk'

Promise.promisifyAll(fs)

var config = require('../config/' + (process.env.NODE_ENV || 'development'))

let imagePresets = [
  [ 'thumb', 200 ],
  [ 'medium', 600 ],
  [ 'large', 1000],
  [ 'huge', 1600 ]
]

export default (imageObject) => {
  return fs.readFileAsync(imageObject.filePath)
  .then((imageBuffer) => {
    return Promise.all(
      promisedSizes(imageObject, imageBuffer, config.photosDir)
    )
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
    let outfile = imageObject.pathToVersion(version)
    fs.ensureDirSync(path.dirname(outfile))
    return   runResize({
      image: imageBuffer,
      outfile: outfile,
      width: width
    })
  })
}

var runResize = (config) => {
  return sharp(config.image)
    .resize(config.width)
    .withMetadata()
    .toFile(config.outfile)
    // .then(() => {
      // console.log(data)
    // })
    .catch((err) => {
      console.log('resizing failed ' + err)
    })
}
