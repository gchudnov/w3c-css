'use strict';

var validator = require('./../index');

var href = 'http://google.com';

validator.validate(href)
  .on('error', function(err) {
    console.log('ERROR', err);
  })
  .on('validation-error', function(data) {
    console.log('validation error', data);
  })
  .on('validation-warning', function(data) {
    console.log('validation warning', data);
  })
  .on('end', function() {
    console.log('validation complete');
  });
