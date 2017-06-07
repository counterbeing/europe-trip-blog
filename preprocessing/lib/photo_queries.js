'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));
Promise.promisifyAll(fs);

exports.default = function (metadata) {
  masterIndex(metadata);
  dateIndex(metadata);
};

var masterIndex = function masterIndex(metadata) {
  var string = JSON.stringify({ 'data': metadata }, null, '\t');
  fs.writeFile('../public/photos/index.json', string);
};

var dateIndex = function dateIndex(metadata) {
  Promise.reduce(metadata, function (set, item) {
    set.add(item.dateCreated);
    return set;
  }, new Set()).map(function (date) {
    Promise.filter(metadata, function (imageObject) {
      return imageObject.dateCreated == date;
    }).then(function (metadata) {
      var dir = '../public/photos/' + date;
      var string = JSON.stringify({ 'data': metadata }, null, '\t');
      mkdirp(dir).then(function () {
        fs.writeFile(dir + '/index.json', string);
      });
    });
  });
};