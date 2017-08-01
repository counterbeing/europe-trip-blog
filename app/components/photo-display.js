import Ember from 'ember'
import InViewportMixin from 'ember-in-viewport'


export default Ember.Component.extend(InViewportMixin, {
  classNames: ['photo-display'],

  viewportOptionsOverride: Ember.on('didInsertElement', function() {
    Ember.setProperties(this, { viewportSpy: true })
  }),

  didEnterViewport() {
    let photo = this.get('photo')
    Ember.set(photo, 'visible', true)
  },

  didExitViewport() {
    let photo = this.get('photo')
    Ember.set(photo, 'visible', false)
  },

  actions: {
    inspectPhoto() {
      this.sendAction('inspect', this.get('photo'))
    }
  },
})
