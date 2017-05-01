import DS from 'ember-data'
import {pluralize} from 'ember-inflector'

export default DS.JSONAPIAdapter.extend({
  namespace: 'data',
  urlForFindAll(modelName) {
    let model = pluralize(modelName)
    let baseUrl = this.buildURL()
    return `${baseUrl}/${model}.json`
  },
  
  urlForFindRecord(id, modelName) {
    let baseUrl = this.buildURL()
    let model = pluralize(modelName)
    return `${baseUrl}/${model}/${id}.json`
  },
})
