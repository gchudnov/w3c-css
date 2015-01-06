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


describe('Parameters', function () {
  this.timeout(10000);

  var urlToValidate = config.url_to_validate;

  // screen, print, ...
  describe('usermedium', function () {

    it('can be specified', function (done) {

      setTimeout(function() {

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

      }, 1000);

    });

    it('set to `all` if not specified', function(done) {

      setTimeout(function() {

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

      }, 1000);

    });

  });

  // css1, css2, css21, css3, svg, svgbasic, svgtiny, mobile, atsc-tv, tv or none
  describe('profile', function () {

    it('can be specified', function (done) {

      setTimeout(function() {

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

      }, 1000);

    });

    it('set to `css3` if not specified', function(done) {

      setTimeout(function() {

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

      }, 1000);

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

  });

});
