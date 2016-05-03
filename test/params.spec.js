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
  this.timeout(config.TEST_TIMEOUT);

  // screen, print, ...
  describe('usermedium', function () {

    it('can be specified', function (done) {
      setTimeout(function() {
        var params = {
          server: config.SERVER,
          url: config.URL_TO_VALIDATE,
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
      }, config.TEST_DELAY);
    });

    it('set to `all` if not specified', function(done) {
      setTimeout(function() {
        var params = {
          server: config.SERVER,
          url: config.URL_TO_VALIDATE
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
      }, config.TEST_DELAY);
    });

  });
  
  // css1, css2, css21, css3, svg, svgbasic, svgtiny, mobile, atsc-tv, tv or none
  describe('profile', function () {
  
    it('can be specified', function (done) {
      setTimeout(function() {
        var params = {
          server: config.SERVER,
          url: config.URL_TO_VALIDATE,
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
      }, config.TEST_DELAY);
    });
  
    it('set to `css3` if not specified', function(done) {
      setTimeout(function() {
        var params = {
          server: config.SERVER,
          url: config.URL_TO_VALIDATE
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
      }, config.TEST_DELAY);
    });
  
  });

  describe('uri & text', function() {

    it('cannot be specified both at the same time', function(done) {
      var params = {
        server: config.SERVER,
        uri: config.URL_TO_VALIDATE,
        text: 'body { }'
      };
      (function() {
        validator.validate(params);
      }).should.throw('either params.uri or params.text should be specified');
      done();
    });

  });

});
