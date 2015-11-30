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
    output: 'soap12',
    warning: 2
  }
};

/**
 * Validate the provided URL
 * @param params or url
 * @param callback A callback to invoke on completion [optional]
 */
function validate(params, callback) {
  params = params || {};

  if(typeof params === 'string') {
    params = { uri: params };
  }

  var hasUri = (params.hasOwnProperty('uri') || params.hasOwnProperty('url'));
  var hasText = params.hasOwnProperty('text');

  if(hasUri && hasText) {
    throw new Error('either params.uri or params.text should be specified');
  }

  if (!(hasUri || hasText)) {
    throw new Error('params.uri or params.text is a required argument');
  }

  if(hasText && !params.text) {
    throw new Error('params.text is empty');
  }

  var urlObj = {
    protocol: config.protocol,
    host: config.host,
    pathname: config.pathname
  };

  var query = {};
  query.profile = params.profile || config.defaultParams.profile;
  query.usermedium = params.usermedium || config.defaultParams.usermedium;
  query.output = config.defaultParams.output;
  query.warning = params.warning || config.defaultParams.warning;

  if(hasUri) {
    query.uri = params.url || params.uri;
  }

  if(hasText) {
    query.text = params.text;
  }

  if(hasUri) {
    urlObj.query = query;
  }

  var serviceUrl = url.format(urlObj);

  var cvs = new CssValidationStream();
  cvs.serviceUrl = serviceUrl;

  var errors, warnings;
  if(callback) {

    var isCalled = false;
    errors = [];
    warnings = [];

    cvs.on('validation-error', function(data) {
      errors.push(data);
    });

    cvs.on('validation-warning', function(data) {
      warnings.push(data);
    });

    cvs.on('error', function(err) {
      if(!isCalled) {
        isCalled = true;
        callback(err);
      }
    });

    cvs.on('end', function() {
      if(!isCalled) {
        isCalled = true;
        var data = {
          errors: errors,
          warnings: warnings
        };
        callback(null, data);
      }
    });
  }

  var str;
  if(hasUri) {
    str = request.get(serviceUrl);
  } else {
    str = request.post({ url: serviceUrl, formData: query });
  }

  str
    .on('error', function(err) {
      cvs.emit('error', err);
    })
    .on('response', function(response) {
      if(response.statusCode >= 400) {
        var message = 'invalid status code: ' + response.statusCode + ', x-w3c-validator-status: ' + response.headers['x-w3c-validator-status'];
        cvs.emit('error', new Error(message));
      }
    })
    .pipe(cvs)
    .on('finish', function() {
      cvs.emit('end');
    });

  return cvs;
}


module.exports.validate = validate;
