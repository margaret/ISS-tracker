# ISS-tracker
Basic implementation of ISS tracking using Google Maps Javascript API and [Open Notify's ISS locator API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/).

## To-do

* Add form to search for flyover predictions
	* add form to html
	* grab info from form and feed city to Google Maps API and get coordinates
	* feed coordinates to Open-Notify predictions
	* display results

* Add option to set google calendar notifications
	* (need to check what this entails but probably this:)
	* Create API key
	* Authenticate user
	* Add event with notification