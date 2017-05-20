'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var exif = require('exiftool');
var Promise = require('bluebird');
// var path = require('path')
Promise.promisifyAll(exif);
Promise.promisifyAll(fs);

exports.default = {
  run: function run() {
    fs.readdirAsync('../public/photos').filter(function (fileName) {
      return fileName.match(/\.jpg$|\.jpeg$/);
    }).map(function (fileName) {
      return fleshOutObject(fileName);
    }).then(function (photos) {
      console.log(photos);
    });
  }
};


var fleshOutObject = function fleshOutObject(name) {
  var path = '../public/photos/' + name;
  var result = getExifData(path);
  return result;
};

var getExifData = function getExifData(path) {
  return fs.readFileAsync(path).then(function (data) {
    return exif.metadataAsync(data);
  }).then(function (metadata) {
    var dimensionsArr = splitImageSize(metadata.imageSize);
    return {
      path: path,
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      // imageSize: metadata.imageSize,
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude
    };
  });
};

var splitImageSize = function splitImageSize(dimensions) {
  return dimensions.split('x');
};

exports.default.run();