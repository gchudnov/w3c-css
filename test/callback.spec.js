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


describe('Callback', function() {
  this.timeout(config.TEST_TIMEOUT);

  it('can be specified to collect all errors and warnings', function(done) {
    setTimeout(function() {
      var params = {
        server: config.SERVER,
        url: config.URL_TO_VALIDATE
      };
      validator.validate(params, function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.should.have.properties('errors', 'warnings');
        data.errors.should.be.an.Array;
        data.warnings.should.be.an.Array;
        done();
      });
    }, config.TEST_DELAY);
  });

  it('can be specified to catch an error on invalid url', function(done) {
    setTimeout(function() {
      var params = {
        server: config.SERVER,
        url: config.URL_NOT_FOUND
      };
      validator.validate(params, function(err) {
        should.exist(err);
        err.should.have.properties('statusCode', 'w3cValidatorStatus');
        err.statusCode.should.be.eql(500);
        err.w3cValidatorStatus.should.be.eql('Abort');
        done();
      });
    }, config.TEST_DELAY);
  });

});
