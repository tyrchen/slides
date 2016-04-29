% Next-gen API system
% Tyr Chen
% Feb 16th, 2015

# Why?

* to unify the look and feel
* to make common tasks easiler
    - performance enhancement
    - statistics
    - ...
* to make it much easiler to write robust API
* embrace best engineering practices

# Features

* unified common layers
    - application layer throttling
    - authentication / authorization / ACL
    - partial response (and aliasing)
    - validation, error code and error message
* built-in model support (waterlime)
* built-in statistics (by collectd/statsd, TBD)
* tons of build-in middlwares (thanks to restify)
* Swagger integration
* introspection (by CLI, swagger-ui and statistics)
* eslint / unit testing / test coverage
* as flexible as using expressjs

# API SDK

* Application()
* middleware
* route
* model
* command

# DEMO

* bad code smells
* swagger ui (API documentation)
* jsdoc (API SDK documentation)
* API look and feel
    - view history & queue
    - partial response

# Future work

* finish a bunch of middlewares
* application level statistics
* Conditional update (if-match for put)
* More tests
* More API examples
* Stabalize the API SDK interface

