'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');

/**
 * NOTE:
 * http://jigsaw.w3.org/css-validator/manual.html
 * ...please make sure that your script will sleep for at least 1 second between requests.
 * The CSS Validation service is a free, public service for all, your respect is appreciated. thanks.
 */


describe('Url', function() {
  this.timeout(config.TEST_TIMEOUT);

  it('can be set as a string argument', function(done) {
    setTimeout(function() {

      // override the default params
      var prevServer = Object.assign({}, validator._config.server);
      if(config.IS_CUSTOM_SERVER) {
        validator._config.server.hostname = config.SERVER.hostname;
        validator._config.server.port = config.SERVER.port;
      }

      validator.validate(config.URL_TO_VALIDATE)
        .on('error', function(err) {
          validator._config.server = prevServer;
          should.not.exist(err);
        })
        .on('end', function() {
          validator._config.server = prevServer;
          done();
        });
    }, config.TEST_DELAY);
  });

  it('can be set via input params', function(done) {
    setTimeout(function() {
      var params = {
        server: config.SERVER,
        url: config.URL_TO_VALIDATE
      };
      validator.validate(params)
        .on('error', function(err) {
          should.not.exist(err);
        })
        .on('end', function() {
          done();
        });

    }, config.TEST_DELAY);
  });

});
