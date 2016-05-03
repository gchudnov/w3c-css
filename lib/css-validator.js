'use strict';

const request = require('request');
const url = require('url');
const once = require('once');
const CssValidationStream = require('./css-validation-stream');

const config = {
  server: {
    protocol: 'http',
    hostname: 'jigsaw.w3.org',
    port: '80',
    pathname: '/css-validator/validator'
  },
  defaultParams: {
    profile: 'css3',
    usermedium: 'all',
    output: 'soap12',
    warning: 2
  }
};

function buildServerConfig(overrideParams) {
  overrideParams = overrideParams || {};
  if(typeof overrideParams === 'string') {
    overrideParams = { host: overrideParams };
  }
  return Object.assign({}, config.server, overrideParams);
}

function makeResponseError(response) {
  const err = new Error(response.statusCode >= 400 ? 'Invalid server response' : 'No error');
  err.statusCode = response.statusCode;
  err.w3cValidatorStatus = response.headers['x-w3c-validator-status'];
  return err;
}

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

  const hasUri = (params.hasOwnProperty('uri') || params.hasOwnProperty('url'));
  const hasText = params.hasOwnProperty('text');

  if(hasUri && hasText) {
    throw new Error('either params.uri or params.text should be specified');
  }

  if (!(hasUri || hasText)) {
    throw new Error('params.uri or params.text is a required argument');
  }

  if(hasText && !params.text) {
    throw new Error('params.text is empty');
  }

  const baseServerConfig = buildServerConfig(params.server);

  const query = {
    profile: params.profile || config.defaultParams.profile,
    usermedium: params.usermedium || config.defaultParams.usermedium,
    output: config.defaultParams.output,
    warning: params.warning || config.defaultParams.warning
  };

  if(hasUri) {
    query.uri = params.url || params.uri;
  }

  if(hasText) {
    query.text = params.text;
  }

  const serverConfig = (hasUri ? Object.assign(baseServerConfig, { query: query }) : baseServerConfig);
  const serviceUrl = url.format(serverConfig);

  const cvs = new CssValidationStream();
  cvs.serviceUrl = serviceUrl;

  var errors, warnings;
  if(callback) {
    const cb = once(callback);

    errors = [];
    warnings = [];

    cvs.on('validation-error', function(data) {
      errors.push(data);
    });

    cvs.on('validation-warning', function(data) {
      warnings.push(data);
    });

    cvs.on('error', function(err) {
      cb(err);
    });

    cvs.on('end', function() {
      cb(null, {
        errors: errors,
        warnings: warnings
      });
    });
  }

  const str = hasUri ? request.get(serviceUrl) : request.post({ url: serviceUrl, formData: query });

  str
    .on('error', function(err) {
      cvs.emit('error', err);
    })
    .on('response', function(response) {
      if(response.statusCode >= 400) {
        cvs.emit('error', makeResponseError(response));
      }
    })
    .pipe(cvs)
    .on('finish', function() {
      cvs.emit('end');
    });

  return cvs;
}


module.exports.validate = validate;
module.exports._config = config;