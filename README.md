# w3c-css  [![Build Status](https://travis-ci.org/gchudnov/w3c-css.svg?branch=master)](https://travis-ci.org/gchudnov/w3c-css)


Validate CSS using [W3C CSS Validation Service](http://jigsaw.w3.org/css-validator/).

_w3c-css_ will check the compliance against CSS profile specified (CSS3 by default) and report errors and potential problems in Cascading Style Sheets.
There are two types of validation events: errors and warnings.
* Errors are reported when the checked CSS does not respect the CSS recommendation.
* Warnings do not state a problem regarding the specification. They are used to notify that some CSS-input and could lead to a strange behaviour on some user agents.


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

## Arguments

The first argument to the `validate` function can be either an URL or an `options` object. The only required option is `uri` or `text`; all others are optional.

Options supported:
* `uri` || `url` - the URL of the document to validate
* `text` - CSS document or fragment to validate. Only CSS-content is allowed
* `profile` - the CSS profile used for the validation: `css1, css2, css21, css3` [default: 'css3']
* `usermedium` - the [medium](http://www.w3.org/TR/CSS2/media.html) used for the validation: `screen, print, ...` [default: 'all', which is suitable for all devices]


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
validator can be invoked from the command line.

Options supported:
* `summary` - get only the number of errors and warnings

```
$ ./node_modules/.bin/w3c-css http://example-site.com/ --summary
validating: http://example-site.com/
validation complete
css-errors: 207, css-warnings: 270

```


## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/w3c-css/blob/master/LICENSE).
