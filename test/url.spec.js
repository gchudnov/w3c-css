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
  this.timeout(config.test_timeout);

  var urlToValidate = config.url_to_validate;

  it('can be set as a string argument', function(done) {

    setTimeout(function() {

      validator.validate(urlToValidate)
        .on('error', function(err) {
          should.not.exist(err);
        })
        .on('end', function() {
          done();
        });

    }, config.test_delay);

  });

  it('can be set via input params', function(done) {

    setTimeout(function() {

      var params = {
        url: urlToValidate
      };

      validator.validate(params)
        .on('error', function(err) {
          should.not.exist(err);
        })
        .on('end', function() {
          done();
        });

    }, config.test_delay);

  });

});
