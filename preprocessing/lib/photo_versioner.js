'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');
var fs = require('fs');
var sharp = require('sharp');
var path = require('path');
var mkdirp = Promise.promisify(require('mkdirp'));
var chalk = require('chalk');

Promise.promisifyAll(fs);
Promise.promisifyAll(sharp);

var photosDir = '../public/photos';

var imagePresets = [['thumb', 100], ['medium', 800], ['large', 1200], ['huge', 1600]];

exports.default = function (imageObject) {
  return fs.readFileAsync(imageObject.path).then(function (imageBuffer) {
    return promiseAllVersions(imageObject, imageBuffer);
  }).then(function (result) {
    console.log(chalk.blue(result));
    return 'fuck me right';
  }).catch(function () {
    console.log('Image resize failed.');
  });
};

var promiseAllVersions = function promiseAllVersions(imageObject, imageBuffer) {
  return Promise.all(imagePresets, function (item) {
    var version = item[0];
    var width = item[1];
    var outfile = path.join(photosDir, version, imageObject.relativePath);
    return mkdirp(path.dirname(outfile)).then(function () {
      console.log(chalk.red(outfile));
      runResize({
        image: imageBuffer,
        outfile: outfile,
        width: width
      });
    }).then(function () {
      console.log('Writing version metadata ' + version);
      return 'HERE I AM';
    });
  });
};

var runResize = function runResize(config) {
  return sharp(config.image).resize(config.width).withMetadata().toFile(config.outfile).then(function () {
    // console.log(data)
  }).catch(function (err) {
    console.log('resizing failed ' + err);
  });
};