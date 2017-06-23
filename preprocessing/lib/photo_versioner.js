'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');
var fs = require('fs-extra');
var sharp = require('sharp');
var path = require('path');
var chalk = require('chalk');

Promise.promisifyAll(fs);

var config = require('../config/' + (process.env.NODE_ENV || 'development'));

var imagePresets = [['thumb', 100], ['medium', 800], ['large', 1200], ['huge', 1600]];

exports.default = function (imageObject) {
  return fs.readFileAsync(imageObject.filePath).then(function (imageBuffer) {
    return Promise.all(promisedSizes(imageObject, imageBuffer, config.photosDir));
  }).catch(function (error) {
    console.log(chalk.red('Image resize failed.'));
    console.log(chalk.red(error));
  });
};

var promisedSizes = function promisedSizes(imageObject, imageBuffer) {
  return Promise.map(imagePresets, function (item) {
    var version = item[0];
    var width = item[1];
    var outfile = imageObject.pathToVersion(version);
    fs.ensureDirSync(path.dirname(outfile));
    return runResize({
      image: imageBuffer,
      outfile: outfile,
      width: width
    });
  });
};

var runResize = function runResize(config) {
  return sharp(config.image).resize(config.width).withMetadata().toFile(config.outfile)
  // .then(() => {
  // console.log(data)
  // })
  .catch(function (err) {
    console.log('resizing failed ' + err);
  });
};