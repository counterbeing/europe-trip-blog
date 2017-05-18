'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
function run() {
  fs.readdirAsync('../public/photos/for_import').map(function (fileName) {
    var pathObject = toPathObject(fileName);
    return {
      'path': pathObject,
      'story': readAndProcess(pathObject)
    };
  }).map(function (pathAndStory) {
    pathAndStory.story.then(function (story) {
      var string = JSON.stringify({ 'data': story }, null, '\t');
      fs.writeFile(pathAndStory.path.jsonPath, string);
    });
    return pathAndStory.story;
  }).then(function (stories) {
    var index = stories.map(function (story) {
      return {
        'type': story.type,
        'id': story.id,
        'attributes': {
          'title': story.attributes.title,
          'date': story.attributes.date
        }
      };
    });
    fs.writeFile('../public/data/stories.json', JSON.stringify({ 'data': index }, null, '\t'));
  });
}