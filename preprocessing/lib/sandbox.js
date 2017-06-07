'use strict';

var Promise = require('bluebird');

var imagePresets = [{ thumb: 100 }, { medium: 800 }, { large: 1200 }, { huge: 1600 }];

function process() {
  return Promise.map(imagePresets, function (item) {
    return item;
  });
}

process().then(function (result) {
  console.log('result:');
  console.log(result);
});