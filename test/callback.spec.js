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
  this.timeout(config.test_timeout);

  var urlToValidate = config.url_to_validate;

  it('can be specified to collect all errors and warnings', function(done) {

    setTimeout(function() {

      validator.validate(urlToValidate, function(err, data) {
        data.should.have.properties('errors', 'warnings');
        data.errors.should.be.an.Array;
        data.warnings.should.be.an.Array;
        done();
      });

    }, config.test_delay);

  });

  it('can be specified to catch an error', function(done) {

    setTimeout(function() {

      validator.validate(config.url_not_found, function(err) {
        should.exist(err);
        done();
      });

    }, config.test_delay);

  });

});
