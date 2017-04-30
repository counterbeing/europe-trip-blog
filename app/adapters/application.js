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
    // return `${baseUrl}/users/${snapshot.adapterOptions.user_id}/playlists/${id}`
    let model = pluralize(modelName)
    return `${baseUrl}/${model}/${id}.json`
  },

  // shouldBackgroundReloadAll: function(store, snapshotArray) {
    // var connection = window.navigator.connection;
    // if (connection === 'cellular' || connection === 'none') {
    //   return false;
    // } else {
      // return true
    // }
  // }

  // buildURL: function(modelName, id, snapshot, requestType, query) {
  //   return 'full_url'
  // },
  // pathForType: function(type) {
  //   var path = pluralize(type) + '.json'
  //   console.log(path)
  //   return path
  // }
})
