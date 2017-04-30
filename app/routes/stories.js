import Ember from 'ember'

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('story')
  },

  afterModel(model) {
    this.transitionTo('story', model.get('lastObject'))
  }
})
