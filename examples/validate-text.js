'use strict';

var validator = require('./../index');

var cssFragment = 'body { background-color: red; }';

validator.validate({ text: cssFragment }, function(err, data) {
  console.log('ERROR', err);
  console.log('DATA', data);
});
