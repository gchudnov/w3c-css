'use strict';

var validator = require('./../index');

var href = 'http://google.com';

validator.validate(href, function(err, data) {
  if(err) {
    console.log('ERROR', err);
  } else {
    console.log('validation errors', data.errors);
    console.log('validation warnings', data.warnings);
  }
});
