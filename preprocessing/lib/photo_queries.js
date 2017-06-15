'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _json_writer = require('./json_writer');

var _json_writer2 = _interopRequireDefault(_json_writer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);
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
  return _json_writer2.default.run('../public/photos/index.json', metadata);
};

var _dateIndex = function _dateIndex(metadata) {
  return Promise.reduce(metadata, function (set, item) {
    set.add(item.dateCreated);
    return set;
  }, new Set()).map(function (date) {
    return Promise.filter(metadata, function (imageObject) {
      return imageObject.dateCreated == date;
    }).then(function (metadata) {
      var dir = '../public/photos/' + date;
      return _json_writer2.default.run(dir + '/index.json', metadata);
    });
  });
};