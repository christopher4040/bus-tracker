
mapboxgl.accessToken = 'pk.eyJ1IjoiY21hbGRvbmFkbzE2IiwiYSI6ImNsMWpsb2FlNjBzbnkzY3M2Z3g0Y2FuZGIifQ.-o5Mn3GJ4yc4kAr1g9ubkA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-71.101, 42.358],
  zoom: 12
});

let markers = [];
let marker = null;

let routes = [];
let route = null;

let timer;

let selectDOM = document.getElementById('form-select');
let routeName = document.getElementById('route-long-name');
let numberBuses = document.getElementById('number-buses');

// create markers and popups
let initializeMarkers = ((locations) => {
  locations.forEach((location) => {
    let busImg = document.createElement('div');
    busImg.id = 'marker';
    let popup = new mapboxgl.Popup({ offset: 25 }).setText(`Bus #${location.attributes.label}`);
    marker = new mapboxgl.Marker(busImg, {anchor: 'bottom'});
    markers.push({'marker':marker, 'popup':popup});
  });
});

async function addMarkers(locations) {
  if (markers == '') {
    initializeMarkers(locations);
  }
  locations.forEach((location, i) => {
    markers[i].marker.setLngLat([location.attributes.longitude, location.attributes.latitude])
    .setPopup(markers[i].popup).addTo(map);
  });
}

async function run() {
  // get bus data    
  const locations = await getBusLocations();
  console.log(locations);
  const markers = await addMarkers(locations);
  // timer
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].attributes.short_name == route) {
      routeName.innerHTML = `Name: ${routes[i].attributes.long_name}`;
      numberBuses.innerHTML = `Buses: ${locations.length}`;
    }
  }
  timer = setTimeout(run, 20000);
}

async function fetchRoutes() {
  // get bus data    
  const routesData = await getRoutes();
  await routesData.forEach((route, i) => { 
    routes.push(route);
    let option = document.createElement('option');
    option.text = route.attributes.short_name;
    selectDOM.add(option, selectDOM[i+1]);
  });
  disableRoutes();
}

function disableRoutes() {
  
}

// Request bus data from MBTA
async function getBusLocations() {
  const url = `https://api-v3.mbta.com/vehicles?filter[route]=${route}`;
  const response = await fetch(url);
  const json     = await response.json();
  return json.data;
}

async function getRoutes() {
  const url = `https://api-v3.mbta.com/routes?filter[type]=3`;
  const response = await fetch(url);
  const json     = await response.json();
  return json.data;
}

function clearMarkers() {
  if (markers != '') {
    for (let i = markers.length-1; i >= 0; i--) {
      markers[i].marker.remove();
      markers[i].popup.remove();
      markers.pop();
    }
  }
}

$('#form-select').change(function() {
  route = $(this).val();
  clearMarkers();
  clearTimeout(timer);
  run();
});

fetchRoutes();
run();

