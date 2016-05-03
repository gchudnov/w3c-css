'use strict';

var isCustomServer = !!process.env.CSS_VALIDATOR;
var server = isCustomServer ? JSON.parse(process.env.CSS_VALIDATOR) : {};

var config = {
  "URL_TO_VALIDATE": "https://github.com/gchudnov/w3c-css",
  "URL_NOT_FOUND": "http://some-invalid-url.net/xrugomndyi97",
  "TEST_DELAY": (isCustomServer ? 0 : 1500),
  "TEST_TIMEOUT": 32000,
  "SERVER": server,
  "IS_CUSTOM_SERVER": isCustomServer
};

module.exports = config;
