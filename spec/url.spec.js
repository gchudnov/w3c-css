'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');


describe('Url', function() {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  it('can be set as a string parameter', function(done) {

    validator.validate(urlToValidate)
      .on('error', function(err) {
        should.not.exist(err);
      })
      .on('end', function() {
        done();
      });

  });

  it('can be set as part of input params', function(done) {

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

  });

  it('cannot be validated if invalid', function(done) {

    validator.validate("http://some-invalid-url.net/xrugomndyi97")
      .on('error', function(err) {
        should.exist(err);
        done();
      });
  });

  it.only('throws an exception if not set', function(done) {

    (function() {
      validator.validate();
    }).should.throw();

    done();

  });

});
