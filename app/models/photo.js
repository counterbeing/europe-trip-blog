import DS from 'ember-data'
// import Ember from 'ember'

export default DS.Model.extend({
  title: DS.attr('string'),
  dateCreated: DS.attr('date'),
})
