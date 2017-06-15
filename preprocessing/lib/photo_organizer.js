'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _photo_versioner = require('./photo_versioner');

var _photo_versioner2 = _interopRequireDefault(_photo_versioner);

var _photo_queries = require('./photo_queries');

var _photo_queries2 = _interopRequireDefault(_photo_queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var exif = require('exiftool');
var Promise = require('bluebird');
var snake = require('to-snake-case');
var moment = require('moment');
var path = require('path');
var mkdirp = Promise.promisify(require('mkdirp'));
// var chalk = require('chalk')
var imghash = require('imghash');
Promise.promisifyAll(exif);
Promise.promisifyAll(fs);

var photosDir = '../public/photos';

exports.default = function () {
  fs.readdirAsync(photosDir).filter(function (fileName) {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/);
  }).map(function (fileName) {
    return fleshOutObject(fileName);
  }).map(function (photo) {
    return moveOriginal(photo);
  }).map(function (photo) {
    var res = (0, _photo_versioner2.default)(photo).then(function (versions) {
      photo.versions = versions;
      return photo;
    });
    return res;
  }).map(function (photo) {
    console.log(photo);
    return Promise.props({
      title: photo.title,
      caption: photo.caption,
      phash: photo.phash,
      dateCreated: photo.dateCreated,
      versions: photo.versions
    });
  }).then(function (metadata) {
    _photo_queries2.default.run(metadata);
  });
};

var moveOriginal = function moveOriginal(photoObject) {
  var newPath = path.join(photosDir, photoObject.dateCreated, 'original', photoObject.relativePath);
  console.log(newPath);

  return mkdirp(path.dirname(newPath)).then(function () {
    fs.rename(photoObject.path, newPath);
  }).then(function () {
    photoObject.path = newPath;
    return photoObject;
  });
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
    var dateObject = formatDate(metadata.dateCreated);
    var formattedDate = dateObject.format('YYYY-MM-DD');

    return {
      path: objectPath,
      relativePath: path.join(snake(metadata.title) + '.jpg'),
      title: metadata.title,
      imageWidth: dimensionsArr[0],
      imageHeight: dimensionsArr[1],
      caption: metadata.imageDescription,
      latitude: metadata.gpsLatitude,
      longitude: metadata.gpsLongitude,
      createdAt: dateObject,
      dateCreated: formattedDate,
      phash: phashFromFile(objectPath)
    };
  });
};

var formatDate = function formatDate(exifDateString) {
  return moment(exifDateString, 'YYYY:MM:DD HH:mm:SS');
};

var phashFromFile = function phashFromFile(path) {
  return imghash.hash(path);
};

var splitImageSize = function splitImageSize(dimensions) {
  return dimensions.split('x');
};

exports.default();