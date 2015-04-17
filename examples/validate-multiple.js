'use strict';

var async = require('async');
var validator = require('./../index');

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
