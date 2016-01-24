# ISS-tracker
Basic implementation of ISS tracking using Google Maps Javascript API and [Open Notify's ISS locator API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/).

## To-do

### General
* Refactor 

### Flyover Predictions
* double check quality of results / filter to be more similar to spot the station?
* see about fixing bug https://github.com/open-notify/Open-Notify-API/issues/5 or at least adding error message when 500 response received. Probably will just have to wrestle with getJSON to produce an error message. 

### Notifications
* (need to check what this entails but probably this:)
* Create API key
* Authenticate user
* Add event with notification

### Weather
* find a free weather API and add a column for weather

