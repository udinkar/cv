var geocoder;
var map;
var directionsService;
var directionsDisplay;
var marker;

var end = "8888+University+Dr+Burnaby+BC+Canada";

function initialize() {
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  
  var myLatLng = {lat: 49.25, lng: -123.04};
  var mapOptions = {
    zoom: 8,
    center: myLatLng
  }
  
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
  markEnd(end);
}

// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
function markEnd(address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(11);
      marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      console.log("Geocode was not successful for the following reason: " + status); // alert
    }
  });
}

// https://developers.google.com/maps/documentation/javascript/examples/directions-simple
function calculateAndDisplayRoute(start, destination) {
  directionsService.route({
    origin: start,
    destination: destination,
    travelMode: google.maps.TravelMode.TRANSIT
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      clearMap();
      directionsDisplay.setDirections(response);
    } else {
      marker.setMap(map);
      window.alert('Directions request failed due to ' + status);
    }
  });
}

// https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// http://stackoverflow.com/questions/5232756/remove-route-with-google-map
function clearMap(){
  directionsDisplay.setDirections({routes: []});
  marker.setMap(null);
}