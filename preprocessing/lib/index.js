'use strict';

var _story_processor = require('./story_processor');

var storyProcessor = _interopRequireWildcard(_story_processor);

var _photo_organizer = require('./photo_organizer');

var _photo_organizer2 = _interopRequireDefault(_photo_organizer);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

console.log(_chalk2.default.green('Processing stories...'));
storyProcessor.run();

console.log(_chalk2.default.green('Processing photos...'));
(0, _photo_organizer2.default)();

console.log(_chalk2.default.green('Uploading photos...'));
(0, _uploader2.default)();