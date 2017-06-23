'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Just getting the hang of testing in JS

var config = require('../config/' + (process.env.NODE_ENV || 'development'));

exports.default = function (num) {
  return num + 1 + config.additional;
};