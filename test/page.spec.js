'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');


describe('Page', function() {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  it('can be validated', function(done) {

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

  });

  it('cannot be validated if URL is invalid', function(done) {

    validator.validate(config.url_not_found)
      .on('error', function(err) {
        should.exist(err);
        done();
      });
  });

  it('cannot be validated without setting a source (uri or text)', function(done) {

    (function() {
      validator.validate();
    }).should.throw();

    done();

  });

});