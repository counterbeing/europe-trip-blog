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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import path from 'path'

var config = require('../config/' + (process.env.NODE_ENV || 'development')); // import photoVersioner from './photo_versioner'

exports.default = function () {
  _fsExtra2.default.readdirAsync(config.photosDir).filter(function (fileName) {
    return fileName.match(/\.(jpg|jpeg|JPG|JPEG)$/);
  }).map(function (fileName) {
    return new _photo2.default(fileName);
  })
  // .catch((err) => {
  //   console.log('fuck' + err)
  // })
  // .map((photo) => {
  //   return moveOriginal(photo)
  // })
  .map(function (photo) {
    photo.process();
    console.log(photo.metadata);
    return photo.metadata;
  }).then(function (metadata) {
    // console.log(metadata)
    _photo_queries2.default.run(metadata);
  });
};

exports.default();