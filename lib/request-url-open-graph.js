'use strict';
const request = require('request');
const cheerio = require('cheerio');
const charset = require('charset');
const iconvLite = require('iconv-lite');
const pkg = require('../package.json');

// eslint-disable-next-line
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36';

const A_SUPPORTED_TAGS = [
  'description',

  // Facebook Open Graph
  'og:url',
  'og:title',
  'og:description',
  'og:type',

  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'og:image:type',
  'og:image:width',
  'og:image:height',

  'og:video',
  'og:video:url',
  'og:video:secure_url',
  // MIME type of the video.
  // Either application/x-shockwave-flash or video/mp4.
  'og:video:type',
  'og:video:width',
  'og:video:height',

  // Twitter Cards Markup Tags
  'twitter:card',
  'twitter:site',
  'twitter:site:id',
  'twitter:creator',
  'twitter:creator:id',
  'twitter:description',
  'twitter:title',
  'twitter:image',
  'twitter:image:alt',
  'twitter:player',
  'twitter:player:width',
  'twitter:player:height',
  'twitter:player:stream',
  'twitter:app:name:iphone',
  'twitter:app:id:iphone',
  'twitter:app:url:iphone',
  'twitter:app:name:ipad',
  'twitter:app:id:ipad',
  'twitter:app:url:ipad',
  'twitter:app:name:googleplay',
  'twitter:app:id:googleplay',
  'twitter:app:url:googleplay'
];

const O_SUPPORTED_TAG_MAP = {
  'description': 'html:description'
};

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

    // debugger;
    if (!oOptions.encoding) {
      const sCharSet = charset(oResponse.headers, oBody, oOptions.peekSize);
      if (sCharSet) {
        sBody = iconvLite.decode(oBody, sCharSet);
      }
    }

    if (!sBody) {
      sBody = oBody.toString();
    }

    const O_TAGS = {};
    const DOM = cheerio.load(sBody);
    const oMetaTags = DOM('meta');
    const aMetaTagKeys = Object.keys(oMetaTags);

    for (var key = 0; key < aMetaTagKeys.length; key++) {
      if (!oMetaTags[key] || (!oMetaTags[key].attribs)) {
        continue;
      }

      const oMetaTagAttrs = oMetaTags[key].attribs;
      const sMetaTagProperty = oMetaTagAttrs.property || oMetaTagAttrs.name;

      if (
        !sMetaTagProperty ||
        !A_SUPPORTED_TAGS.includes(sMetaTagProperty)) {
        continue;
      }

      O_TAGS[
        O_SUPPORTED_TAG_MAP[sMetaTagProperty] || sMetaTagProperty
      ] = oMetaTagAttrs.content;
    }

    O_TAGS['html:url'] = oOptions.url;
    O_TAGS['html:title'] = DOM('title').text();

    return fCallback(null, O_TAGS);
  });
};
