'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_chalk2.default.green('Uploading photos...'));
(0, _uploader2.default)();