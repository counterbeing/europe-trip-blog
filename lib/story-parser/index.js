/* eslint-env node */

'use strict'

var _ = require('lodash')
var chalk = require('chalk')
// var fs = require('fs')
var globby = require('globby')
var moment = require('moment')

module.exports = {
  name: 'story-parser',

  isDevelopingAddon: function() {
    return true
  },

  pathToDate: function(path) {
    var dateString = path.match(/\d\d\d\d_\d\d_\d\d/)
    var momentDate = moment(dateString, 'YYYY_MM_DD')
    return momentDate.format('dddd, MMMM Do, YYYY')
  },

  buildObject: (path) => {
    // console.log('path provided to pathToDate:' + path)
    // console.log('this is: ' + this)
    return {
      'path': path,
      'date': this.pathToDate(path),
    }
  },

  extractData: (paths) => {
    console.log('built obj: ' + this.buildObject('1234_12_12_fuckey'))
    return _.map(paths, this.buildObject)
  },

  writeStories: function(paths){
    var objects = this.extractData(paths)
    var json = JSON.stringify(objects)
    console.log(json)
    // fs.writeFile('public/stories.json', json, 'utf8')
  },

  preBuild: function () {
    globby(['data/stories/*']).then(paths => {
      console.log(chalk.blue(paths))
      this.writeStories(paths)
    })
  }
}
