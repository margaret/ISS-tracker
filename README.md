# ISS-tracker
Basic implementation of ISS tracking using Google Maps Javascript API, GeoNames, SunCalc.js, Moment-timezone.js, and [Open Notify's ISS locator API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/).

## To-do

### General
* Refactor
* make padString have default args

### Flyover Predictions
* double check quality of results / filter to be more similar to spot the station?
* include direction of approach (nvm for now. I think this would require adding more stuff to Open-Notify)
* see about fixing bug https://github.com/open-notify/Open-Notify-API/issues/5 or at least adding error message when 500 response received. Probably will just have to wrestle with getJSON to produce an error message. 

### Notifications
* prob should use the API properly instead of generating links. Requires deeper javascript understanding. 

### Weather
* find a free weather API and add a column for weather
