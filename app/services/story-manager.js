import Ember from 'ember'

export default Ember.Service.extend({
  currentlySelectedStory: undefined,

  setCurrentlySelectedStory: function(story) {
    this.set('currentlySelectedStory', story)
  },

  showSelectedStory: function() {
    if (this.get('currentlySelectedStory')) {
      console.log('Displaying: ' + this.get('currentlySelectedStory'))
    } else {
      console.log('select a damn story')
    }
  }
})
