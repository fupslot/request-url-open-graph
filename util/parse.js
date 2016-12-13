'use strict';
const cheerio = require('cheerio');
const color = require('colors/safe');
const util = require('util');
const debuglog = util.debuglog('parser');

const A_SUPPORTED_TAGS = [
  'description',

  // Facebook Open Graph
  'og:url',
  'og:title',
  'og:description',
  'og:type',
  'og:site',

  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'og:image:type',
  'og:image:width',
  'og:image:height',

  'og:video',
  'og:video:url',
  'og:video:secure_url',
  'og:video:type',
  'og:video:width',
  'og:video:height',

  'og:audio',
  'og:audio:secure_url',
  'og:audio:type',

  // Support following twitter cards markup tags
  'twitter:description',
  'twitter:title',
  'twitter:image',
  'twitter:site'
];

const O_OG_ARRAY = {
  'og:video': 'url',
  'og:image': 'url',
  'og:audio': 'url'
};

const A_OG_ARRAY_PROP = [
  'og:image:url',
  'og:image:secure_url',
  'og:image:type',
  'og:image:width',
  'og:image:height',
  'og:video:url',
  'og:video:secure_url',
  'og:video:type',
  'og:video:width',
  'og:video:height',
  'og:audio:secure_url',
  'og:audio:type',
];

const O_PROPERTIES_MAP = {
  'twitter:site': 'og:site',
  'twitter:title': 'og:title',
  'twitter:description': 'og:description',
  'twitter:image': 'og:image',
  'description': 'og:description',
  'title': 'og:title',
  'url': 'og:url'
};

const getOGTagName = function(sName) {
  return sName.split(':')[1];
};

const getOGTagProperty = function(sName) {
  return sName.split(':')[2];
};

module.exports = function(sBody, {url}) {
  const O_TAGS = {};
  const DOM = cheerio.load(sBody);
  const oMetaTags = DOM('meta');
  const aMetaTagKeys = Object.keys(oMetaTags);

  for (var key = 0; key < aMetaTagKeys.length; key++) {
    if (!oMetaTags[key] || (!oMetaTags[key].attribs)) {
      continue;
    }

    const oMetaAttrs = oMetaTags[key].attribs;
    let sMetaProperty = oMetaAttrs.property || oMetaAttrs.name;

    if (
      !sMetaProperty ||
      !A_SUPPORTED_TAGS.includes(sMetaProperty)) {

      debuglog(
        color.red(`${sMetaProperty} [NOT SUPPORTED]`)
      );
      continue;
    }

    debuglog(
      color.green(
        `${sMetaProperty} Mapped to: ${O_PROPERTIES_MAP[sMetaProperty] || 'self'}`
      )
    );

    sMetaProperty = O_PROPERTIES_MAP[sMetaProperty] || sMetaProperty;

    const sMetaContent = oMetaAttrs.content;
    const sTagName = getOGTagName(sMetaProperty);

    if (O_OG_ARRAY[sMetaProperty]) {
      O_TAGS[sTagName] = O_TAGS[sTagName] || [];

      const oTag = {};
      oTag[O_OG_ARRAY[sMetaProperty]] = sMetaContent;
      O_TAGS[sTagName].push(oTag);
    } else if (A_OG_ARRAY_PROP.includes(sMetaProperty)) {
      const sTagName = getOGTagName(sMetaProperty);
      const sPropertyName = getOGTagProperty(sMetaProperty);

      if (!O_TAGS[sTagName]) {
        O_TAGS[sTagName] = [];
      }

      const nLength = O_TAGS[sTagName].length;

      if (nLength > 0) {
        let oLastTag = O_TAGS[sTagName][nLength - 1];

        if (oLastTag[sPropertyName]) {
          oLastTag = {};
          O_TAGS[sTagName].push(oLastTag);
        }

        oLastTag[sPropertyName] = sMetaContent;
      } else {
        const oTag = {};
        oTag[sPropertyName] = sMetaContent;
        O_TAGS[sTagName].push(oTag);
      }
    } else {
      O_TAGS[sTagName] = sMetaContent;
    }
  }

  if (!O_TAGS['url']) {
    O_TAGS['url'] = url;
  }

  if (!O_TAGS['title']) {
    O_TAGS['title'] = DOM('title').text();
  }

  return O_TAGS;
};
