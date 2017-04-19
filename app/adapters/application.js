import DS from 'ember-data'
import {pluralize} from 'ember-inflector'

export default DS.JSONAPIAdapter.extend({
  namespace: 'data',
  pathForType: function(type) {
    return pluralize(type) + '.json'
  }
})
