import Ember from 'ember'

export default Ember.Route.extend({
  storyService: Ember.inject.service('story-manager'),

  model() {
    return this.get('store').findAll('story')
  },

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
