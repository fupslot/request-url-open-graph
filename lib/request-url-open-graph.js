'use strict';
const request = require('request');
const charset = require('charset');
const iconvLite = require('iconv-lite');
const parseOpenGraph = require('../util/parse-open-graph');
const pkg = require('../package.json');

// eslint-disable-next-line
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36';

module.exports = function(oOptions, fCallback) {
  oOptions = Object.assign({
    // Specify the URL string
    url: null,
    // Number of milliseconds to wait for a server to send response headers
    // (and start the response body) before aborting the request
    timeout: 15000,
    // Custom HTTP headers
    headers: {},
    encoding: 'utf8',
    gzip: true,
    peekSize: 1024
  }, oOptions);

  oOptions.headers = Object.assign({}, {
    'User-Agent': USER_AGENT
  }, oOptions.headers);

  if (!oOptions.url) {
    return fCallback(
      Error(
        `(${pkg.name}) options.url expect a valid URL and got ${oOptions.url}`
      )
    );
  }

  request(oOptions, (oError, oResponse, oBody) => {
    if (oError) {
      return fCallback(oError);
    }

    let sBody;

    if (!oOptions.encoding) {
      const sCharSet = charset(oResponse.headers, oBody, oOptions.peekSize);
      if (sCharSet) {
        sBody = iconvLite.decode(oBody, sCharSet);
      }
    } else {
      sBody = oBody.toString();
    }

    const O_TAGS = parseOpenGraph(sBody, oOptions);
    return fCallback(null, O_TAGS);
  });
};
