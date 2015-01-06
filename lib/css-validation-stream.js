'use strict';

var sax = require('sax');
var util = require('util');
var Writable = require('stream').Writable;

/**
 * CSS Parser
 * @param options
 * @constructor
 */
function CSSValidationStream(options) {
  options = options || {};

  Writable.call(this, options);

  var self = this;

  var xmlParser = sax.createStream(true, {});
  self.xmlParser = xmlParser;

  var tagName;

  var lastUri;
  var lastEvent;

  var lastFault;

  // text
  xmlParser.on('text', function (text) {
    switch(tagName) {
      case 'm:uri':
        lastUri = text.trim();
        break;

      case 'm:line':
        lastEvent.line = text.trim();
        break;

      case 'm:level':
        lastEvent.level = text.trim();
        break;

      case 'm:errortype':
        lastEvent.errorType = text.trim();
        break;

      case 'm:errorsubtype':
        lastEvent.errorSubtype = text.trim();
        break;

      case 'm:type':
        lastEvent.type = text.trim();
        break;

      case 'm:context':
        lastEvent.context = text.trim();
        break;

      case 'm:message':
        lastEvent.message = text.trim();
        break;

      case 'm:skippedstring':
        lastEvent.skippedString = text.trim();
        break;

      case 'env:text':
        if(lastFault) {
          lastFault.message = text.trim();
        }
        break;

      default:
        // no-op
        break;
    }
  });

  // opentag
  xmlParser.on('opentag', function (node) {
    tagName = node.name.toLowerCase();

    switch (tagName) {
      case 'm:errorlist':
      case 'm:warninglist':
        lastUri = '';
        break;

      case 'm:error':
      case 'm:warning':
        lastEvent = {};
        break;

      case 'env:fault':
        lastFault = {};
        break;

      default:
        // no-op
        break;
    }
  });

  // closetag
  this.xmlParser.on('closetag', function (name) {
    tagName = name.toLowerCase();

    switch (tagName) {
      case 'm:error':
        lastEvent.uri = lastUri;
        self.emit('validation-error', lastEvent);
        break;

      case 'm:warning':
        lastEvent.uri = lastUri;
        self.emit('validation-warning', lastEvent);
        break;

      case 'env:fault':
        self.emit('error', new Error(lastFault.message));
        lastFault = undefined;
        break;

      default:
        // no-op
        break;
    }

    tagName = undefined;
  });

  // error
  xmlParser.on('error', function (err) {
    self.emit('error', err);
  });

}

util.inherits(CSSValidationStream, Writable);

CSSValidationStream.prototype._write = function(chunk, encoding, next) {
  this.xmlParser.write(chunk);
  next();
};


CSSValidationStream.prototype.EVENTS = [
  'validation-error',
  'validation-warning',
  'error',
  'end'
];

module.exports = CSSValidationStream;
