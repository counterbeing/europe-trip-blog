'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));
var path = require('path');
Promise.promisifyAll(fs);

exports.default = function (filePath, object) {
  var string = JSON.stringify({ 'data': object }, null, '\t');
  var dir = path.dirname(filePath);
  return mkdirp(dir).then(function () {
    fs.writeFile(filePath, string);
  }).catch(function (reason) {
    console.log('Failed to write json file: ' + reason);
  });
};