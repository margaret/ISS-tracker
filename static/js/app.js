function getIssLocation() {
	$.getJson('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
		var lat = data['iss-position']['latitude'];
		var lon = data['iss-position']['longitude'];
		console.log(lat, lon)
	})
}

var main = function() {
	getIssLocation();
}

$(document).ready(main);