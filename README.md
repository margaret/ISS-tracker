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

https://www.google.com/calendar/render?action=TEMPLATE&text=ISS+Flyover&dates=20160127T224000Z/20160127T224500Z&details=International+Space+Station+flyover!+Via+http://margaretsy.com/ISS-tracker&location=Philadelphia,+PA&sf=true&ctz=America/New_York&output=xml

bad output
https://www.google.com/calendar/render?action=TEMPLATE&text=ISS+Flyover&details=International+Space+Station+flyover!+Via+http://margaretsy.com/ISS-tracker&dates=20160126T82200Z/20160126T82700Z&location=Your+Mom&ctz=America/New_York&output=xml


http://www.google.com/calendar/event?action=TEMPLATE&dates=20160128T024500Z%2f20160128T050000Z&sprop=website%3ahttp%3a%2f%2fwww.meetup.com%2fWomen-Who-Code-East-Bay%2fevents%2f228235143%2f&text=Code+Study+Meetup+in+Berkeley+%28right+next+to+the+downtown+BART%29&location=NextSpace+Berkeley+-+2081+Center+Street+-+Berkeley%2C+CA&sprop=name:Women+Who+Code+East+Bay&details=For+full+details%2C+including+the+address%2C+and+to+RSVP+see%3A%0Ahttp%3A%2F%2Fwww.meetup.com%2FWomen-Who-Code-East-Bay%2Fevents%2F228235143%2F%0AWomen+Who+Code+East+Bay%0ANextSpace+Berkeley%2C+a+beautiful+co-working+space+right+next+to+the+Berkeley+downtown+BART%2C+has+graciously+offered+to+host+Women+Who+Code+East+Bay%27s...