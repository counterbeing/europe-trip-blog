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
    return Promise.all(promisedSizes(imageObject, imageBuffer));
  }).then(function (result) {
    return Promise.reduce(result, function (total, chunk) {
      var version = chunk.version;
      var outfile = chunk.outfile;
      total[version] = outfile;
      return total;
    }, {});
  }).catch(function (error) {
    console.log(chalk.red('Image resize failed.'));
    console.log(chalk.red(error));
  });
};

var promisedSizes = function promisedSizes(imageObject, imageBuffer) {
  return Promise.map(imagePresets, function (item) {
    var version = item[0];
    var width = item[1];
    var outfile = path.join(photosDir, version, imageObject.relativePath);
    return mkdirp(path.dirname(outfile)).then(function () {
      runResize({
        image: imageBuffer,
        outfile: outfile,
        width: width
      });
      return { version: version, outfile: outfile };
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