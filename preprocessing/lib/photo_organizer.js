'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _photo_queries = require('./photo_queries');

var _photo_queries2 = _interopRequireDefault(_photo_queries);

var _photo = require('./photo');

var _photo2 = _interopRequireDefault(_photo);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import photoVersioner from './photo_versioner'
var config = require('../config/' + (process.env.NODE_ENV || 'development'));

exports.default = function () {
  _fsExtra2.default.readdirAsync(config.photosDir).filter(function (fileName) {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/);
  }).map(function (fileName) {
    return new _photo2.default(fileName);
  }).map(function (photo) {
    return moveOriginal(photo);
  }).map(function (photo) {
    photo.process();
    return photo.metadata;
  }).then(function (metadata) {
    _photo_queries2.default.run(metadata);
  });
};

var moveOriginal = function moveOriginal(photoObject) {
  var newPath = _path2.default.join(config.photosDir, photoObject.dateCreated, 'original', photoObject.relativePath);

  return _fsExtra2.default.mkdirp(_path2.default.dirname(newPath)).then(function () {
    _fsExtra2.default.rename(photoObject.path, newPath);
  }).then(function () {
    photoObject.path = newPath;
    return photoObject;
  });
};

exports.default();