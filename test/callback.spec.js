'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');

describe('Callback', function() {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  it('can be specified to collect all errors and warnings', function(done) {

    validator.validate(urlToValidate, function(err, data) {
      data.should.have.properties('errors', 'warnings');
      data.errors.should.be.an.Array;
      data.warnings.should.be.an.Array;
      done();
    });

  });

  it('can be specified to catch an error', function(done) {

    validator.validate(config.url_not_found, function(err, data) {
      should.exist(err);
      done();
    });

  });

});
