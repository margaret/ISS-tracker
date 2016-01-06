var SunCalc = window.SunCalc;
var map;
var marker;
var geocoder;
function initMap(latitude, longitude) {
  console.log(latitude, longitude)
  var issPoint = {lat: latitude, lng: longitude};
  map = new google.maps.Map(document.getElementById('map'), {
    center: issPoint,
    zoom: 4,
    scrollwheel: false
  });
  // Set marker position.
  marker = new google.maps.Marker({
    map: map,
    position: issPoint,
    title: 'ISS is here!'
  });
  geocoder = new google.maps.Geocoder();
}

$("#updateMap").click(setIssPosition);
$("#getLocation").click(geocodeLocation);
$('#flyoverAddress').keypress(function(e) {
	var event = e || window.event;
	var charCode = event.which || event.keyCode;
	if (charCode == '13') {
		event.preventDefault();
		geocodeLocation();
	}
})

var openNotifyEndpoint = 'http://api.open-notify.org/iss-now.json?callback=?'

function getIssPosition() {
	$.getJSON(openNotifyEndpoint, function(data) {
		initMap(data.iss_position.latitude, data.iss_position.longitude);
	});
}

function setIssPosition() {
	$.getJSON(openNotifyEndpoint, function(data) {
		var issPoint = {lat: data.iss_position.latitude, lng: data.iss_position.longitude};		
		console.log("updating ISS position to " + issPoint.lat + ", " + issPoint.lng)
		map.setCenter(issPoint);
		marker.setPosition(issPoint);
	});
}

function geocodeLocation() {
	var formVal = document.getElementById("flyoverAddress").value;
	console.log("Searched for: " + formVal);
	geocoder.geocode({ 'address': formVal}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      	console.log(results.length + " results");
      	console.log("Response 0 Coordinates:");
      	console.log(results[0].geometry.location.toString());
      	console.log("Response 0 address:");
      	console.log(results[0].formatted_address);

      	getPassTimes(results[0].geometry.location.lat(), results[0].geometry.location.lng(), formVal, results[0].formatted_address);

      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
      	  document.getElementById('passTimes').innerHTML = '';
      	  $('#passTimes').append('<tr><td>' + "No results for " + formVal + '</tr></td>');
      } else {
      	  document.getElementById('passTimes').innerHTML = '';
      	  $('#passTimes').append('<tr><td>Error: ' + status + '</td></tr>');
      }
  })
}

function getPassTimes(lat, lon, addr, formattedAddr) { 
	$.getJSON('http://api.open-notify.org/iss-pass.json?lat='+ lat +'&lon=' + lon + '&alt=20&n=20&callback=?', function(data) {
		displayPassTimes(data, formattedAddr)
	});
}

function displayPassTimes(data, formattedAddr) {
	var flyoverList = document.getElementById("passTimes");
	flyoverList.innerHTML = '';
	$('#passTimes').append('<tr><th>Flyover times for ' + formattedAddr + '</th><th>Duration</th></tr>');
	var lat = data['request']['latitude'];
	var lon = data['request']['longitude'];
    data['response'].forEach(function (d) {
        var date = new Date(d['risetime']*1000);
        var duration = d['duration'];
        var minutes = Math.floor(duration / 60);
        var seconds = duration - (minutes * 60);
        console.log("-------------------------------------------");
		console.log("ISS pass on ", date.toString());
        if (isNighttime(lat, lon, date)) {
        	console.log("night");
        	if (isHellaEarly(date)) {
        		console.log("Ain't nobody getting up that early.");
        		$('#passTimes').append('<tr class=info><td>' + date.toString() + '</td><td>' + minutes + ' m ' + seconds + ' s</td></tr>');	
        	} else {
        		console.log("It's all good.");
        		$('#passTimes').append('<tr class=success><td>' + date.toString() + '</td><td>' + minutes + ' m ' + seconds + ' s</td></tr>');
        	}
        } else if (isBeforeDawn(lat, lon, date)) {
        	console.log("dawn " + date);
        	$('#passTimes').append('<tr class=warning><td>' + date.toString() + '</td><td>' + minutes + ' m ' + seconds + ' s</td></tr>');
        }
    });
	// Color Key
	$('#passTimes').append('<tr><th>Key</th></tr><tr><td class="success"><small>Nighttime</small></tr><td class="warning"><small>Before sunrise</small><tr><td class="info"><small>Lol nope</small></tr><tr></tr>')
}

function isNighttime(lat, lon, date) {
	// return whether Date date is after the previous sunset and the next sunrise at (lat, lon)
	var times = SunCalc.getTimes(date, lat, lon);
	return (date < times.nightEnd) || (times.night < date);
}

function isBeforeDawn(lat, lon, date) {
	// return whether date is after nightEnd but still before Dawn
	var times = SunCalc.getTimes(date, lat, lon);
	return (times.nightEnd < date) && (date < times.dawn);
}

function isHellaEarly(date) {
	// This is all in local time
	var fiveAM = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5);
	var twoAM = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2);
	console.log("should be 2am: " + twoAM);
	console.log("ostensibly 5am: " + fiveAM)
	return (twoAM < date) && (date < fiveAM);
}

