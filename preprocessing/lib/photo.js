'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _exiftool = require('exiftool');

var _exiftool2 = _interopRequireDefault(_exiftool);

var _toSnakeCase = require('to-snake-case');

var _toSnakeCase2 = _interopRequireDefault(_toSnakeCase);

var _imghash = require('imghash');

var _imghash2 = _interopRequireDefault(_imghash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_bluebird2.default.promisifyAll(_exiftool2.default);

var Photo = function () {
  function Photo(filePath) {
    _classCallCheck(this, Photo);

    this.filePath = filePath;
  }

  _createClass(Photo, [{
    key: 'metaData',
    value: function metaData() {
      return _bluebird2.default.join(this.exifData(), phashFromFile(this.filePath), function (exif, phash) {
        return Object.assign(exif, { phash: phash });
      });
    }
  }, {
    key: 'phash',
    value: function phash() {
      return { phash: phashFromFile(this.filePath) };
    }
  }, {
    key: 'exifData',
    value: function exifData() {
      var _this = this;

      if (this.storedExifData) {
        return this.storedExifData;
      }

      return _fsExtra2.default.readFileAsync(this.filePath).then(function (data) {
        return _exiftool2.default.metadataAsync(data);
      }).then(function (metadata) {
        var dimensionsArr = splitImageSize(metadata.imageSize);
        var dateObject = formatDate(metadata.dateCreated);
        var formattedDate = dateObject.format('YYYY-MM-DD');

        return {
          path: _this.filePath,
          relativePath: _path2.default.join((0, _toSnakeCase2.default)(metadata.title) + '.jpg'),
          title: metadata.title,
          imageWidth: dimensionsArr[0],
          imageHeight: dimensionsArr[1],
          caption: metadata.imageDescription,
          latitude: metadata.gpsLatitude,
          longitude: metadata.gpsLongitude,
          createdAt: dateObject,
          dateCreated: formattedDate
        };
      });
    }
  }]);

  return Photo;
}();

var formatDate = function formatDate(exifDateString) {
  return (0, _moment2.default)(exifDateString, 'YYYY:MM:DD HH:mm:SS');
};

var phashFromFile = function phashFromFile(path) {
  return _imghash2.default.hash(path);
};

var splitImageSize = function splitImageSize(dimensions) {
  return dimensions.split('x');
};

exports.default = Photo;