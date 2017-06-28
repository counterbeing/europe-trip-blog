'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var s3 = require('s3');
var config = require('../config/index');

var client = s3.createClient({
  maxAsyncS3: 20,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  multipartUploadThreshold: 20971520,
  multipartUploadSize: 15728640,
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-1'
  }
});

var params = {
  localDir: config.photosDir,
  s3Params: {
    Bucket: 'europe-trip-blog',
    Prefix: ''
  }
};

exports.default = function () {
  var uploader = client.uploadDir(params);
  uploader.on('error', function (err) {
    console.error('unable to sync:', err.stack);
  });
  // uploader.on('progress', function() {
  //   console.log('progress', uploader.progressAmount, uploader.progressTotal)
  // })
  uploader.on('end', function () {
    console.log('done uploading');
  });
};