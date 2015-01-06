'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');


describe('Url', function() {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  it('can be set as a string argument', function(done) {

    validator.validate(urlToValidate)
      .on('error', function(err) {
        should.not.exist(err);
      })
      .on('end', function() {
        done();
      });

  });

  it('can be set via input params property', function(done) {

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

});
