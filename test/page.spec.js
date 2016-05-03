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
  this.timeout(config.TEST_TIMEOUT);

  it('can be validated', function(done) {
    setTimeout(function() {
      var errorCount = 0;
      var warningCount = 0;

      var params = {
        server: config.SERVER,
        url: config.URL_TO_VALIDATE
      };
      validator.validate(params)
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

    }, config.TEST_DELAY);
  });

  it('cannot be validated if URL is invalid', function(done) {
    setTimeout(function() {
      var params = {
        server: config.SERVER,
        url: config.URL_NOT_FOUND
      };
      validator.validate(params)
        .on('error', function(err) {
          should.exist(err);
          err.should.have.properties('statusCode', 'w3cValidatorStatus');
          err.statusCode.should.be.eql(500);
          err.w3cValidatorStatus.should.be.eql('Abort');
          done();
        });

    }, config.TEST_DELAY);
  });

  it('cannot be validated without setting a source (uri or text)', function(done) {
    (function() {
      validator.validate();
    }).should.throw('params.uri or params.text is a required argument');
    done();
  });

});
