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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var config = require('../config/index');

exports.default = function () {
  return loadPhotosIndex().then(function (existingPhotos) {
    return processNewPhotos(existingPhotos);
  });
};

var processNewPhotos = function processNewPhotos(existingPhotos) {
  return _fsExtra2.default.readdirAsync(config.photosDir).filter(function (fileName) {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/);
  }).map(function (fileName) {
    var file = _path2.default.join(config.photosDir + '/' + fileName);
    return new _photo2.default(file);
  }).map(function (photo) {
    return photo.process().then(function () {
      return photo.metadata;
    });
  }, { concurrency: 5 }).then(function (metadata) {
    return [].concat(_toConsumableArray(metadata), _toConsumableArray(existingPhotos));
  }).then(function (allMetadata) {
    return _photo_queries2.default.run(allMetadata);
  });
};

var loadPhotosIndex = function loadPhotosIndex() {
  var masterIndexFile = _path2.default.join(config.photosDir, 'masterIndex.json');
  var exists = _fsExtra2.default.pathExistsSync(masterIndexFile);
  return exists ? _fsExtra2.default.readJson(masterIndexFile) : Promise.all([]);
};