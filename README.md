![w3c-css logo](http://i.imgur.com/csJN5BV.png)
# w3c-css  [![Build Status](https://travis-ci.org/gchudnov/w3c-css.svg?branch=master)](https://travis-ci.org/gchudnov/w3c-css)

> Validate CSS using [W3C CSS Validation Service](http://jigsaw.w3.org/css-validator/).

_w3c-css_ will check the compliance against CSS profile specified (CSS3 by default) and report errors and potential problems in Cascading Style Sheets.
There are two types of validation events: errors and warnings.
* Errors are reported when the checked CSS does not respect the CSS recommendation.
* Warnings do not state a problem regarding the specification. They are used to notify that some CSS-input and could lead to a strange behaviour on some user agents.

## Installation
```bash
$ npm install w3c-css
```


## Usage

```javascript
'use strict';
var validator = require('w3c-css');

validator.validate('https://github.com/', function(err, data) {
  if(err) {
    // an error happened
    console.error(err);
  } else {
    // validation errors
    console.log('validation errors', data.errors);

    // validation warnings
    console.log('validation warnings', data.warnings);
  }

});

```

OR listen for events:

```javascript
'use strict';
var validator = require('w3c-css');

validator.validate('https://github.com/')
  .on('error', function(err) {
    // an error happened
    console.error(err);
  })
  .on('validation-error', function(data) {
    // validation error
    console.log(data);
  })
  .on('validation-warning', function(data) {
    // validation warning
    console.log(data);
  })
  .on('end', function() {
    // validation complete
  });

```

## Public vs. Private CSS Validator
* The public [CSS Validation service](https://jigsaw.w3.org/css-validator/) requires a delay for at least 1 second between the requests.
* Run a [private copy](https://jigsaw.w3.org/css-validator/DOWNLOAD.html) of the CSS Validator without delay restrictions. 

### Private CSS Validator
To deploy a private CSS Validator, use the following npm commands below to run a [Docker](https://www.docker.com/)-based instance locally or use an official [guideline](https://jigsaw.w3.org/css-validator/DOWNLOAD.html) to download and install it.

Building a docker image of the CSS Validator:
```
$ npm run validator:build
```

Running the container:
```
$ npm run validator:run
```
or
```
$ npm run validator:run:detach
```

Locating IP:PORT of the running docker container:
```
$ npm run validator:find
```
Prints an object, like `{ "hostname": "172.17.0.2", "port": 8080 }` if the container is running. Pass the returned object as a value for the `server` argument to the `validate` function.


### Public CSS Validator
Please make sure your script [sleep for at least 1 second between requests](http://jigsaw.w3.org/css-validator/manual.html).
The CSS Validation service is a free, public service for all, your respect is appreciated.

To validate multiple links, use [async](https://github.com/caolan/async#eachseriesarr-iterator-callback) + [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout) or any related way to pause between the requests:  

```javascript
'use strict';

var async = require('async');
var validator = require('w3c-css');

var hrefs = ['http://google.com', 'https://developer.mozilla.org', 'http://www.microsoft.com/'];

async.eachSeries(hrefs, function(href, next) {
  validator.validate(href, function(err, data) {
    if(err) {
      console.log('Failed to process: ' + href, err);
    } else {
      console.log('validation errors on ' + href, data.errors);
      console.log('validation warnings on ' + href, data.warnings);
    }

    setTimeout(function() { next(err); }, 1500); // sleep for 1.5 second between the requests
  });
}, function(err) {
  if(err) {
    console.log('Failed to process a url', err);
  } else {
    console.log('All urls have been processed successfully');
  }
});
```

## Arguments

The first argument to the `validate` function can be either an URL or an `options` object. The only required option is `uri` or `text`; all others are optional.

Options supported:
* `uri` || `url` - the URL of the document to validate
* `text` - CSS document or fragment to validate. Only CSS-content is allowed
* `profile` - the CSS profile used for the validation: `css1, css2, css21, css3` [default: 'css3']
* `usermedium` - the [medium](http://www.w3.org/TR/CSS2/media.html) used for the validation: `screen, print, ...` [default: 'all', which is suitable for all devices]
* `warning` - the warning level, "no" for no warnings, 0 for less warnings, 1or 2 for more warnings [default: 2] 
* `server` - the "IP:PORT" string or the [URL object](https://nodejs.org/api/url.html) of a custom validation server, e.g, `'172.17.0.2:8080'` or `{ host: '172.17.0.2:8080' }`

The  [optional] callback argument gets 2 arguments:

* `err` - an error
* `data` - a result object with `errors` and `warnings` properties.


## CSS Errors & Warnings
`errors` and `warnings` reported by the library are the arrays of following objects:

```javascript
{
  line: '...',      // refers to the line where the error or warning was detected
  message: '...'    // the error or warning message

  // additional properties:
  errorType: '...', // type of the error
  context: '...',   // context of the error
  level: '...',     // the level of the warning
  uri: '...'        // URL of the stylesheet
}
```


## Events

All events are emitted with a single argument. The list of supported events are exported in the
`EVENTS` array. Assign handlers using the EventEmitter `on` function.

* `validation-error` - raised on CSS-validation error
* `validation-warning` - raised on CSS-validation warning
* `error` - raised when a problem with validator is encountered, e.g. an invalid URL was specified
* `end` - raised on completion. There will be no other events raised after this one.


## CLI
As an alternative, validator can be invoked from the command line.

Options supported:
* `summary` - print only the number of errors and warnings
* `host` - defines a custom validation server, e.g.: `172.17.0.2:8080`

For local installs:
```
$ ./node_modules/.bin/w3c-css example-site.com --summary
```

For global installs (-g):
```
$ w3c-css example-site.com
```

With custom validation server:
```
$ w3c-css example-site.com --host=172.17.0.2:8080
```

Sample output:
```
$ ./node_modules/.bin/w3c-css example-site.com --summary
validating: http://example-site.com
validation complete
css-errors: 207, css-warnings: 270
```

## Plugins
* Gulp plugin: [gulp-w3c-css](https://github.com/gchudnov/gulp-w3c-css)

## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/w3c-css/blob/master/LICENSE).
