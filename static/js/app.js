

var main = function() {
	console.log("Hi there.");
	document.getElementById('flyoverAddress').onkeypress = function(e) {
		var event = e || window.event;
		var charCode = event.which || event.keyCode;
		if (charCode == '13') {
			geocodeLocation();
		}
	}
}

$(document).ready(main);