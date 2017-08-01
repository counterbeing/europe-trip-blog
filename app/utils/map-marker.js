const L = window.L

export default function mapMarker() {
  return L.icon({
    iconUrl: '/blue-dot-with-shadow.png',
    iconSize: [15, 15],
    iconAnchor: [0, 0],
    popupAnchor: [-3, -76],
  })
}
