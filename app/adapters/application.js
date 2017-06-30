import DS from 'ember-data'
import {pluralize} from 'ember-inflector'
import config from '../config/environment'


export default DS.JSONAPIAdapter.extend({
  namespace: 'data',
  urlForFindAll(modelName) {
    let model = pluralize(modelName)
    let baseUrl = this.buildURL()
    return `${baseUrl}${config.rootURL}${model}.json`
  },

  urlForFindRecord(id, modelName) {
    let baseUrl = this.buildURL()
    let model = pluralize(modelName)
    return `${baseUrl}${config.rootURL}/${model}/${id}.json`
  },
})
