mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom:10 // starting zoom
});

const marker = new mapboxgl.Marker({color:"black"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h4>${listing.location}</h4>
    <p>this is the exact location for catchup</p>
    `)
)
.addTo(map);