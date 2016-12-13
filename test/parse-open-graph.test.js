'use strict';
const expect = require('expect');
const pkg = require('../package.json');
const parseOpenGraph = require('../util/parse-open-graph');

const sUrl = 'https://www.example.com/index.html';

describe(`${pkg.name}`, function() {

  it('parse open graph', function() {
    const graph = parseOpenGraph(require('./html.basic'), sUrl);
    expect(graph).toBeA('object');

    expect(graph.url).toExist();
    expect(graph.title).toExist();
    expect(graph.description).toExist();

    expect(graph.image).toBeA('array');
    expect(graph.image.length).toBe(4);
    expect(graph.image[0]).toIncludeKeys(
      ['url', 'width', 'height', 'type', 'secure_url']
    );

    expect(graph.video).toBeA('array');
    expect(graph.video.length).toBe(1);

    expect(graph.audio).toBeA('array');
    expect(graph.audio.length).toBe(1);
  });

  it('(graphless) should return basic tags', function() {
    const graph = parseOpenGraph(require('./html.graphless'), sUrl);

    expect(graph).toBeA('object');
    expect(graph.title).toExist();
    expect(graph.url).toExist();
  });

  it('(twitter card) should return mapped tags', function() {
    const graph = parseOpenGraph(require('./html.twitter-card'), sUrl);

    expect(graph).toBeA('object');
    expect(graph).toIncludeKeys(['title', 'description', 'url', 'image']);
    expect(graph.image).toBeA('array');
    expect(graph.image[0]).toIncludeKey('url');
  });
});
