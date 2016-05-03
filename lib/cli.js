#!/usr/bin/env node

'use strict';

var url = require('url');
var nopt = require('nopt');
var validator = require('./css-validator.js');


var knownOpts = {
  "summary": Boolean,
  "host": String
};
var shortHands = {};

var parsed = nopt(knownOpts, shortHands, process.argv, 2);

// href
var href = parsed.argv.remain.length ? parsed.argv.remain[0] : '';
if(!href) {
  console.error('url not specified');
  return;
}

if(href.indexOf('http') == -1) {
  href = url.format({
    protocol: 'http',
    host: href
  });
}

var errorCount = 0;
var warningCount = 0;

console.log('validating: ' + href);

var validationParams = { uri: href };
if(parsed.host) {
  validationParams.server = { host: parsed.host };
}

validator.validate(validationParams)
  .on('error', function(err) {
    console.error('application fault:', err);
  })
  .on('validation-error', function(data) {
    ++errorCount;
    if(!parsed.summary) {
      console.log('css-error:', data);
    }
  })
  .on('validation-warning', function(data) {
    ++warningCount;
    if(!parsed.summary) {
      console.log('css-warning:', data);
    }
  })
  .on('end', function() {
    console.log('validation complete');
    console.log('css-errors: ' + errorCount + ', css-warnings: ' + warningCount);
  });
