w3c-css
=======

CSS Validation using [W3C CSS Validation Service](http://jigsaw.w3.org/css-validator/)

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

The first argument to the `validate` function can be either an URL or an `options` object. The only required option is `uri`; all others are optional.

Options supported:
* `uri` || `url` - the URL of the document to validate
* `profile` - the CSS profile used for the validation: `css1, css2, css21, css3` [default: 'css3']
* `usermedium` - the medium used for the validation: `screen, print, ...` [default: 'all']
* `callback` - [optional] callback to invoke on completion


The callback argument gets 2 arguments:

1. `err` - an error
2. `data` - a result object with `errors` and `warnings` properties. `data.errors` and `data.warnings` are the arrays on objects:
```javascript
{
  line: '...', // refers to the line where the error or warning was detected
  message: '...' // the error or warning message
  //...
}
```

## Events

All events are emitted with a single argument. The list of supported events are exported in the
`EVENTS` array. Assign handlers using the EventEmitter `on` function.

* `validation-error` - raised on validation error
* `validation-warning` - raised on validation warning
* `error` - raised when a problem with validator is encountered, e.g. invalid URL
* `end` - raised on completion


  
