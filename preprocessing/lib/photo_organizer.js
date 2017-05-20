'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var exif = require('exiftool');
var Promise = require('bluebird');
var snake = require('to-snake-case');
var moment = require('moment');
var path = require('path');
// const imghash = require('imghash')
// var path = require('path')
Promise.promisifyAll(exif);
Promise.promisifyAll(fs);

var photosDir = '../public/photos';

exports.default = {
  run: function run() {
    fs.readdirAsync(photosDir).filter(function (fileName) {
      return fileName.match(/\.jpg$|\.jpeg$/);
    }).map(function (fileName) {
      return fleshOutObject(fileName);
    }).map(function (photo) {
      console.log(photo);
      movePhoto(photo);
    });
  }
};


var movePhoto = function movePhoto(photoObject) {
  var date = photoObject.dateCreated.format('YYYY-MM-DD');
  var dateFolder = path.join(photosDir, date);
  var newPath = newPhotoPath(photoObject, date);
  console.log('checking for dir');
  fs.statAsync(dateFolder).then(null, function () {
    fs.mkdir(dateFolder);
  }).then(function () {
    console.log('running rename of ' + photoObject.path);
    fs.rename(photoObject.path, newPath);
  });
};

var newPhotoPath = function newPhotoPath(photoObject, date) {
  var title = snake(photoObject.title);
  return path.join(photosDir, date, title + '.jpg');
};

var fleshOutObject = function fleshOutObject(name) {
  var objectPath = path.join(photosDir, name);
  var result = getExifData(objectPath);
  return result;
};

var getExifData = function getExifData(objectPath) {
  return fs.readFileAsync(objectPath).then(function (data) {
    return exif.metadataAsync(data);
  }).then(function (metadata) {
    var dimensionsArr = splitImageSize(metadata.imageSize);
    // console.log(metadata)
    return {
      path: objectPath,
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude,
      dateCreated: formatDate(metadata.dateCreated)
      // phash: phashFromFile(path)
    };
  });
};

var formatDate = function formatDate(exifDateString) {
  return moment(exifDateString, 'YYYY:MM:DD HH:mm:SS');
};

// var phashFromFile = (path) => {
//   return imghash.hash(path)
// }

var splitImageSize = function splitImageSize(dimensions) {
  return dimensions.split('x');
};

exports.default.run();