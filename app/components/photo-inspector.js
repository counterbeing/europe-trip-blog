import Ember from 'ember'
import MapMarkers from '../utils/map-marker'

export default Ember.Component.extend({
  classNames: ['photo-inspector'],
  mapMarker: MapMarkers(),
})
