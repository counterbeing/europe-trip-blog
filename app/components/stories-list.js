import Ember from 'ember'

export default Ember.Component.extend({
  storyService: Ember.inject.service('story-manager'),

  store: Ember.inject.service(),

  // return this.get('store').findAll('story')
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
      // console.log(story.id)
      this.get('storyService').setCurrentlySelectedStory(story.id)
    }
  }
})
