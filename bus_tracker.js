
mapboxgl.accessToken = 'pk.eyJ1IjoiY21hbGRvbmFkbzE2IiwiYSI6ImNsMWpsb2FlNjBzbnkzY3M2Z3g0Y2FuZGIifQ.-o5Mn3GJ4yc4kAr1g9ubkA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-71.101, 42.358],
        zoom: 13
	});

let markers = [];

// create markers and popups
let initializeMarkers = ((locations) => {
	locations.forEach((location) => {
		let busImg = document.createElement('div');
		busImg.id = 'marker';
		let popup = new mapboxgl.Popup({ offset: 25 }).setText(`Bus #${location.attributes.label}`);
		let marker = new mapboxgl.Marker(busImg, {anchor: 'bottom'});

		markers.push({'marker':marker, 'popup':popup});
	})
});

async function addMarkers(locations) {
	if (markers == '') {
		initializeMarkers(locations);
	}
	locations.forEach((location, i) => {
		markers[i].marker.setLngLat([location.attributes.longitude, location.attributes.latitude]).setPopup(markers[i].popup).addTo(map);
	});
}


async function run(){
    // get bus data    
	const locations = await getBusLocations();

	const markers = await addMarkers(locations);
	// timer
	setTimeout(run, 20000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = `https://api-v3.mbta.com/vehicles?filter[route]=1`;
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

run();