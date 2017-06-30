import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['photos-list'],
  inspectorVisible: false,
  inspectedValue: null,
  actions: {
    inspect(photo) {
      Ember.set(this, 'inspectorVisible', true)
      Ember.set(this, 'inspectedValue', photo)
    },

    closeInspector() {
      Ember.set(this, 'inspectorVisible', false)
    }
  }
})
