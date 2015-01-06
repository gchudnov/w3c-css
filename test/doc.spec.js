'use strict';

var should = require('should');
var path = require('path');
var fs = require('fs');
var validator = require('./../index');
var config = require('./config');

describe('Document', function() {
  this.timeout(10000);

  it('can be validated with no errors or warnings', function(done) {

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

  });

  it('can be validated with warnings', function(done) {

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

  });

  it('can be validated with errors', function(done) {

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

  });

});
