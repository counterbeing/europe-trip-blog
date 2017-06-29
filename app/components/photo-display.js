import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['photo-display'],
  actions: {
    showInspector() {
      this.set('inspectorShown', true)
    },
  },
})
