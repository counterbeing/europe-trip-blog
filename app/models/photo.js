import DS from 'ember-data'

export default DS.Model.extend({
  title: DS.attr('string'),
  dateCreated: DS.attr('string'),
  createdAt: DS.attr('date'),
  filename: DS.attr('string'),
  caption: DS.attr('string'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
})
