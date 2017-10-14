'use strict';
const cheerio = require('cheerio');
const util = require('util');

const TAG_PROP = [
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

const TYPEOF_ARRAY = {
  'og:video': 'url',
  'og:image': 'url',
  'og:audio': 'url'
};

const ARRAY_PROP = [
  'og:image:url',
  'og:image:src',
  'og:image:secure_url',
  'og:image:type',
  'og:image:width',
  'og:image:height',
  'og:video:url',
  'og:video:src',
  'og:video:secure_url',
  'og:video:type',
  'og:video:width',
  'og:video:height',
  'og:audio:secure_url',
  'og:audio:type'
];

const MAP_PROP = {
  'twitter:site': 'og:site',
  'twitter:title': 'og:title',
  'twitter:description': 'og:description',
  'twitter:image': 'og:image',
  'description': 'og:description',
  'title': 'og:title',
  'url': 'og:url',
  'image_src': 'og:image'
};


module.exports = function(sBody, {url}) {
  const O_TAGS = {};
  const $ = cheerio.load(sBody);
  const tags = $('meta,link').toArray();

  const getPropertyName = (meta) => meta.substr(meta.lastIndexOf(':') + 1);

  const tagReducer = (graph, tag) => {
    const attrs = tag.attribs;
    let metaName = attrs.property || attrs.name || attrs.rel;
    
    // Use MAP_PROP to associate non standart properties with OG
    metaName = MAP_PROP[metaName] || metaName;

    if (!metaName) return graph;

    const propertyValue = attrs.content || attrs.value || attrs.href;

    if (!TAG_PROP.includes(metaName)) return graph;

    if (TYPEOF_ARRAY[metaName]) {
      const propertyName = getPropertyName(metaName);

      graph[propertyName] = graph[propertyName] || [];
      graph[propertyName].push({ [TYPEOF_ARRAY[metaName]]: propertyValue });
    } else if (ARRAY_PROP.includes(metaName)) {
      const arrayName = getPropertyName(metaName.substr(0, metaName.lastIndexOf(':')));
      const propertyName = getPropertyName(metaName);
      
      if (!graph[arrayName]) graph[arrayName] = [];
      
      const nLength = graph[arrayName].length;

      if (nLength > 0) {
        let lastItem = graph[arrayName][nLength - 1];

        if (lastItem[propertyName]) {
          graph[arrayName].push({ [propertyName]: propertyValue });
        } else {
          lastItem[propertyName] = propertyValue;
        }
      } else {
        graph[arrayName].push({ [propertyName]: propertyValue });
      }
    } else {
      const propertyName = getPropertyName(metaName);
      graph[propertyName] = propertyValue;
    }

    return graph;
  };

  const graph = tags.reduce(tagReducer, {});

  if (!graph.url) graph.url = url;
  if (!graph.title) graph.title = $('title').text();

  return graph;
};
