import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['photo-display'],
  actions: {
    inspectPhoto() {
      this.sendAction('inspect', this.get('photo'))
    }
  },
})
