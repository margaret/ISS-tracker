function initMap(latitude = -25.363, longitutde = 131.044) {
  var myLatLng = {lat: latitude, lng: longitutde};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 4
  });

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    title: 'Hello World!'
  });
}

function getIssLocation() {
	console.log("Hi.")
}

var main = function() {
	getIssLocation();
	initMap();
}

$(document).ready(main);