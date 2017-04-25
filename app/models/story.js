import DS from 'ember-data'
import Ember from 'ember'

export default DS.Model.extend({
  storyService: Ember.inject.service('story-manager'),
  selected: Ember.computed(
    'id', 'storyService.currentlySelectedStory', function(){
      return this.get('id') ==
        this.get('storyService').currentlySelectedStory
    }
  ),
  title: DS.attr('string'),
  date: DS.attr('date')
})
