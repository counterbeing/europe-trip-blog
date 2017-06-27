'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require('bluebird'); // Accepts metadata in the form of a massive array of objects
// and then spits out pre filtered json files for any needed
// API endpoint for photos.

var config = require('../config/index');

exports.default = {
  run: function run(metadata) {
    return Promise.all([_masterIndex(metadata), _dateIndex(metadata)]);
  },

  masterIndex: function masterIndex(metadata) {
    return _masterIndex(metadata);
  },

  dateIndex: function dateIndex(metadata) {
    return _dateIndex(metadata);
  }
};


var _masterIndex = function _masterIndex(metadata) {
  return _fsExtra2.default.writeJson(config.photosDir, metadata, { spaces: 2 });
};

var _dateIndex = function _dateIndex(metadata) {
  return Promise.reduce(metadata, function (set, item) {
    set.add(item.dateCreated);
    return set;
  }, new Set()).map(function (date) {
    return Promise.filter(metadata, function (imageObject) {
      return imageObject.dateCreated == date;
    }).then(function (metadata) {
      var file = config.photosDir + date + '/index.json';
      return _fsExtra2.default.writeJson(file, metadata, { spaces: 2 });
    });
  });
};