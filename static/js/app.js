var author = "margaret";
var SunCalc = window.SunCalc;
var moment = window.moment;
// Current ISS Location 
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

// Actions
$("#updateMap").click(setIssPosition);
$("#getLocation").click(geocodeLocation);
$('#flyoverAddress').keypress(function(e) {
	var event = e || window.event;
	var charCode = event.which || event.keyCode;
	if (charCode == '13') {
		event.preventDefault();
		geocodeLocation();
	}
});

// Current Location
var openNotifyEndpoint = 'http://api.open-notify.org/iss-now.json?callback=?'

function getIssPosition() {
	$.getJSON(openNotifyEndpoint, function(data) {
		initMap(data.iss_position.latitude, data.iss_position.longitude);
	});
}

function setIssPosition() {
	$.getJSON(openNotifyEndpoint, function(data) {
		var issPoint = {lat: data.iss_position.latitude, lng: data.iss_position.longitude};		
		map.setCenter(issPoint);
		marker.setPosition(issPoint);
	});
}


// Flyovers
function geocodeLocation() {
	var formVal = document.getElementById("flyoverAddress").value;
	geocoder.geocode({ 'address': formVal}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
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
	$.getJSON('http://api.open-notify.org/iss-pass.json?lat='+ lat +'&lon=' + lon + '&alt=20&n=50&callback=?', function(data) {
		displayPassTimes(data, formattedAddr);
	});
}


function displayPassTimes(data, formattedAddr) {
	var flyoverList = document.getElementById("passTimes");
	flyoverList.innerHTML = '';
  flyoverData = []; 
	$('#passTimes').append('<tr><th>Flyover times for ' + formattedAddr + '</th><th>Duration</th></tr>');
	var lat = data['request']['latitude'];
	var lon = data['request']['longitude'];
  var invisiPass = 0;
    data['response'].forEach(function (d) {
        var date = new Date(d['risetime']*1000);
        var duration = d['duration'];
        var minutes = padString(Math.floor(duration / 60), 2, "0", "left");
        var seconds = padString(duration - (minutes * 60), 2, "0", "left");
        console.log("-------------------------------------------");
		    console.log("ISS pass on ", date.toString());
        if (visibleEvening(lat, lon, date)) {
            constructTableRow(lat, lon, date, "", minutes, seconds, formattedAddr);
        } else if (visibleMorning(lat, lon, date)) {
          constructTableRow(lat, lon, date, "", minutes, seconds, formattedAddr);
        } else if (maybeVisible(lat, lon, date)) {
          constructTableRow(lat, lon, date, "", minutes, seconds, formattedAddr)
        } else { // too bright or too dark
          invisiPass += 1;
          $('#passCount').text('There were also ' + invisiPass + ' non-visible passes.');
        }
    });
}

function constructTableRow(lat, lon, date, category, min, sec, address) {
  // insert the time and duration of a flyover with the correct timezone 
  // and color coding for time of day
  // I feel like I should move the timezone query outside since you really 
  // only need to do it once, but I'm still having a hard time thinking in 
  // terms of callbacks
  var rowStart = '<tr class=' + category + '><td>';
  var rowEnd = '</td><td>' + min + ' m ' + sec + ' s</td></tr>';
  var utc = date.getTime();
  // I am aware this is bad practice. If I wasn't hosting on static pages I'd read it in from a non-public file. 
  $.getJSON("http://api.geonames.org/timezoneJSON?lat=" + lat + "&lng=" + lon + "&username=" + author, function(data) {
    if (!('status' in data)) {
      var tz = data['timezoneId'];
      var queryMoment = moment.tz(utc, tz);
      var correctedDate = queryMoment.format("ddd, MMM Do YYYY, hh:mm:ss a");
      console.log(correctedDate);
      var dateWithLink = "<a target='_blank' href='" + calendarLink(moment(queryMoment), min, sec, tz, address) + "'>" + correctedDate + "</a>";
      $('#passTimes').append(rowStart + dateWithLink + rowEnd);
    } else {
      $('#passTimes').append(rowStart + "Sorry, this feature is broken right now :(" + rowEnd);
    }
    $('#tzInfo').text("All times for " + queryMoment.format("Z") + " GMT");
  })
}

function calendarLink(startTime, durationMinutes, durationSeconds, tz, humanAddr) {
  // Well yes ideally we would use the Google Calendar Javascript API
  // But things aren't always ideal
  // Are they
  
  // Why doesn't built-in URI encoding handle punctuation

  // startTime is a moment-timezone object.
  // calendar time should be in UTC
  var beginTime = startTime.format("YYYYMMDD") + "T" + startTime.format() + "Z"
  var urlBase = "https://www.google.com/calendar/render?action=TEMPLATE&text=ISS+Flyover&details=International+Space+Station+flyover!+Via+http://margaretsy.com/ISS-tracker&output=xml" 
  var begin = startTime.utc().year() + padString(startTime.utc().month()+1) + padString(startTime.utc().date()) + "T" + padString(startTime.utc().hour()) + padString(startTime.utc().minute()) + '00Z';
  var endMoment = startTime.add(parseInt(durationMinutes), 'minutes').add(parseInt(durationSeconds), 'seconds');
  var end = endMoment.utc().year() + padString(endMoment.utc().month()+1) + padString(endMoment.utc().date()) + "T" + padString(endMoment.utc().hour()) + padString(endMoment.utc().minute()) + '00Z';
  var dates = "&dates=" + begin + "/" + end;
  // var dates = makeEventDates(beginTime, durationMinutes, durationSeconds);
  var location = "&location=" + humanAddr.split(' ').join('+');
  var timezone = "&ctz=" + tz;
  return urlBase + dates + location + timezone;
}

// Helper methods
function padString(num, width, pad, side) {
  if (width === undefined) {
    width = 2;
  }
  if (pad === undefined) {
    pad = '0';
  }
  if (side === undefined) {
    side = 'left';
  }
  var padded = num.toString();
  while (padded.length < width) {
    if (side == "left") {
      padded = pad + padded;
    } else {
      padded = padded + pad;
    }
  }
  return padded
}

function isNighttime(lat, lon, date) {
	// return whether Date date is after the previous sunset and the next sunrise at (lat, lon)
	var times = SunCalc.getTimes(date, lat, lon);
	return (date < times.nightEnd) || (times.night < date);
}

function maybeVisible(lat, lon, date) {
  // Arbitrary. Within some hours after sunset and some hours before sunrise.
  var times = SunCalc.getTimes(date, lat, lon);
  var late = new Date(times.sunset);
  late.setHours(late.getHours() + 3);
  var early = new Date(times.sunrise);
  early.setHours(early.getHours() - 3);
  var possibleLate = (times.sunset < date) && (date < late);
  var possibleEarly = (early < date) && (date < times.sunrise);
  return possibleLate || possibleEarly
}

function visibleEvening(lat, lon, date) {
  // return whether date is after sunset but before night
  var times = SunCalc.getTimes(date, lat, lon);
  return (times.dusk < date) && (date < times.night);
}

function visibleMorning(lat, lon, date) {
	// return whether date is after nightEnd but still before Dawn
	var times = SunCalc.getTimes(date, lat, lon);
	return (times.nightEnd < date) && (date < times.dawn);
}
