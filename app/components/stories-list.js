import Ember from 'ember'

export default Ember.Component.extend({
  storyService: Ember.inject.service('story-manager'),

  store: Ember.inject.service(),

  classNames: ['stories-index'],

  showStories: Ember.on('didInsertElement', function() {
    this.get('store').findAll('story').then((stories) => {
      this.set('stories', stories)
    })
  }),

  actions: {
    showServiceState: function() {
      this.get('storyService').showSelectedStory()
    },

    selectStory: function(story) {
      this.get('storyService').setCurrentlySelectedStory(story.id)
    }
  }
})
