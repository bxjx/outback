Outback
--------

Outback is a mobile web application for employment service providers trying to
find meaningful employment for people in remote Australian communities. 

The application is designed to work during extended periods offline and then
sync back with the JNSolutions Bridge webserver API when possible. It's
intended for tablets, rugged computers and mobile devies.

The project is a simple rails 3.1 project that serves out a single page app
written in coffeescript using backbone. Testing is done with jasmine.

Email info@jnsolutions.com.au If you're interested in helping
out with the project. We're always looking for talented programmers.

### Todo this release:

* handle 500s and 404 on sync
* better test for not being online

### General todo:

* handle 500 on caseload
* add web worker for import
* add delete data
* add confirmation that they are deleteing the local data
* add modernizer for testing support
