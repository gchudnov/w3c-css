'use strict';

var should = require('should');
var validator = require('./../index');
var config = require('./config');


describe('Parameters', function () {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  // screen, print, ...
  describe('usermedium', function () {

    it('can be specified', function (done) {

      var params = {
        url: urlToValidate,
        usermedium: 'screen'
      };

      var str = validator.validate(params);
      str
        .on('error', function (err) {
          should.not.exist(err);
        })
        .on('end', function () {
          str.serviceUrl.should.match(/usermedium=screen/);
          done();
        });

    });

    it('set to `all` if not specified', function(done) {

      var params = {
        url: urlToValidate
      };

      var str = validator.validate(params);
      str
        .on('error', function (err) {
          should.not.exist(err);
        })
        .on('end', function () {
          str.serviceUrl.should.match(/usermedium=all/);
          done();
        });

    });

  });

  // css1, css2, css21, css3, svg, svgbasic, svgtiny, mobile, atsc-tv, tv or none
  describe('profile', function () {

    it('can be specified', function (done) {

      var params = {
        url: urlToValidate,
        profile: 'css2'
      };

      var str = validator.validate(params);
      str
        .on('error', function (err) {
          should.not.exist(err);
        })
        .on('end', function () {
          str.serviceUrl.should.match(/profile=css2/);
          done();
        });

    });

    it('set to `css3` if not specified', function(done) {

      var params = {
        url: urlToValidate
      };

      var str = validator.validate(params);
      str
        .on('error', function (err) {
          should.not.exist(err);
        })
        .on('end', function () {
          str.serviceUrl.should.match(/profile=css3/);
          done();
        });

    });

  });

  describe('uri & text', function() {

    it('cannot be specified both at the same time', function(done) {

      var params = {
        uri: urlToValidate,
        text: 'body { }'
      };
      (function() {
        validator.validate(params);
      }).should.throw();

      done();

    });

  })

});
