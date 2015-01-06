'use strict';

var request = require('request');
var url = require('url');
var CssValidationStream = require('./css-validation-stream');

var config = {
  protocol: 'http',
  host: 'jigsaw.w3.org',
  pathname: '/css-validator/validator',
  defaultParams: {
    profile: 'css3',
    usermedium: 'all',
    output: 'soap12'
  }
};

/**
 * Validate the provided URL
 * @param params
 */
function validate(params) {
  params = params || {};

  if(typeof params === 'string') {
    params = { uri: params };
  }

  if (!(params.hasOwnProperty('uri') || params.hasOwnProperty('url'))) {
    throw new Error('URL not specified');
  }

  var query = {};
  query.uri = params.url || params.uri;
  query.profile = params.profile || config.defaultParams.profile;
  query.usermedium = params.usermedium || config.defaultParams.usermedium;
  query.output = config.defaultParams.output;

  var urlObj = {
    protocol: config.protocol,
    host: config.host,
    pathname: config.pathname,
    query: query
  };
  var serviceUrl = url.format(urlObj);

  var cvs = new CssValidationStream();
  cvs.serviceUrl = serviceUrl;

  request(serviceUrl)
    .pipe(cvs)
    .on('finish', function() {
      cvs.emit('end');
    });

  return cvs;
}


module.exports.validate = validate;
