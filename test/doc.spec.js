'use strict';

var should = require('should');
var path = require('path');
var fs = require('fs');
var validator = require('./../index');
var config = require('./config');

/**
 * NOTE:
 * http://jigsaw.w3.org/css-validator/manual.html
 * ...please make sure that your script will sleep for at least 1 second between requests.
 * The CSS Validation service is a free, public service for all, your respect is appreciated. thanks.
 */


describe('Document', function() {
  this.timeout(config.test_timeout);

  it('can be validated with no errors or warnings', function(done) {

    setTimeout(function() {

      var cssPath = path.join(__dirname, './css/has-no-errors.css');
      var params = {
        text: fs.readFileSync(cssPath)
      };

      validator.validate(params, function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.errors.should.be.instanceof(Array).and.have.lengthOf(0);
        data.warnings.should.be.instanceof(Array).and.have.lengthOf(0);
        done();
      });

    }, config.test_delay);

  });

  it('can be validated with warnings', function(done) {

    setTimeout(function() {

      var cssPath = path.join(__dirname, './css/has-warnings.css');
      var params = {
        text: fs.readFileSync(cssPath)
      };

      validator.validate(params, function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.errors.should.be.instanceof(Array).and.have.lengthOf(0);
        data.warnings.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });

    }, config.test_delay);

  });

  it('can be validated with errors', function(done) {

    setTimeout(function() {

      var cssPath = path.join(__dirname, './css/has-errors.css');
      var params = {
        text: fs.readFileSync(cssPath)
      };

      validator.validate(params, function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.errors.should.be.instanceof(Array).and.have.lengthOf(1);
        data.warnings.should.be.instanceof(Array).and.have.lengthOf(0);
        done();
      });

    }, config.test_delay);

  });

  it('cannot be validated if text is empty', function(done) {

    var params = {
      text: ''
    };

    (function() {
      validator.validate(params);
    }).should.throw();

    done();

  });

});
