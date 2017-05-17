var yamlFront = require('yaml-front-matter')
var fs = require('fs')
var Promise = require('bluebird')
var marked = require('marked')
var path = require('path')
Promise.promisifyAll(fs)

fs.readdirAsync('../markdown/')
  .map(function(fileName) {
    var pathObject = toPathObject(fileName)
    return {
      'path': pathObject,
      'story': readAndProcess(pathObject)
    }
  })
  .map((pathAndStory) => {
    pathAndStory.story.then( (story) => {
      var string = JSON.stringify({'data': story}, null, '\t')
      fs.writeFile(pathAndStory.path.jsonPath, string)
    })
    return pathAndStory.story
  })
  .then((stories) => {
    var index = stories.map((story) => {
      return {
        'type': story.type,
        'id': story.id,
        'attributes': {
          'title': story.attributes.title,
          'date': story.attributes.date
        }
      }
    })
    fs.writeFile(
      '../public/data/stories.json',
      JSON.stringify({ 'data': index }, null, '\t')
    )
  })

var toPathObject = (mdFile) => {
  var mdPath = path.join('../markdown/', mdFile)
  var id = path.basename(mdPath, '.md')
  return {
    'id': id,
    'jsonPath': path.join('../public/data/stories/', id + '.json'),
    'mdPath': mdPath
  }
}


var readAndProcess = (mdFile) => {
  return fs.readFileAsync(mdFile.mdPath)
  .then(yamlFront.loadFront).then(function (val) {
    return {
      'type': 'story',
      'id': mdFile.id,
      'attributes': {
        'title': val.title,
        'subtitle': val.subtitle,
        'date': '2017-04-06',
        'region': 'maybe',
        'body': marked(val.__content)
      }
    }
  })
.catch(SyntaxError, function () {
  console.error('invalid yaml in file')
})
.catch(function () {
  console.error('unable to read file')
})
}
