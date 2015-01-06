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


describe('Page', function() {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  it('can be validated', function(done) {

    setTimeout(function() {

      var errorCount = 0;
      var warningCount = 0;

      validator.validate(urlToValidate)
        .on('validation-error', function(data) {
          should.exist(data);
          data.should.have.properties('line', 'message');
          ++errorCount;
        })
        .on('validation-warning', function(data) {
          should.exist(data);
          data.should.have.properties('line', 'message');
          ++warningCount;
        })
        .on('end', function() {
          errorCount.should.be.greaterThan(0);
          warningCount.should.be.greaterThan(0);
          done();
        });

    }, 1000);

  });

  it('cannot be validated if URL is invalid', function(done) {

    setTimeout(function() {

      validator.validate(config.url_not_found)
        .on('error', function(err) {
          should.exist(err);
          done();
        });

    }, 1000);

  });

  it('cannot be validated without setting a source (uri or text)', function(done) {

    (function() {
      validator.validate();
    }).should.throw();

    done();

  });

});
