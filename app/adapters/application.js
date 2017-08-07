import DS from 'ember-data'
import Ember from 'ember'
const config = require('../config/environment')
const { String: { pluralize } } = Ember

let rootURL = config.default.rootURL

export default DS.JSONAPIAdapter.extend({
  namespace: 'data',
  suffix: '.json',
  buildURL: function(modelName, id, snapshot, requestType, query) {
    if(id) {
      let pluralModel = pluralize(modelName)
      let url = join(rootURL, pluralModel, `${id}.json`)
      // return `${rootURL}${pluralModel}/${id}.json`
      return url
    } else {
      let prefix = this._super(modelName, id, snapshot, requestType, query)
      let suffix = this.get('suffix')
      let combined =  join(rootURL, (prefix + suffix))
      return combined
    }
  }
});

function join() {
  var parts = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split("/"));
  }
  var newParts = [];
  for (i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];
    if (!part || part === ".") continue;
    if (part === "..") newParts.pop();
    else newParts.push(part);
  }
  if (parts[0] === "") newParts.unshift("");
  return newParts.join("/") || (newParts.length ? "/" : ".");
}
