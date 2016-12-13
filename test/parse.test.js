'use strict';
const expect = require('expect');
const pkg = require('../package.json');
const parse = require('../util/parse');

const sUrl = 'https://www.example.com/index.html';

describe(`${pkg.name}`, function() {

  it('parse open graph', function() {
    const graph = parse(require('./html.basic'), {url: sUrl});
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
    const graph = parse(require('./html.graphless'), {url: sUrl});

    expect(graph).toBeA('object');
    expect(graph.title).toExist();
    expect(graph.url).toExist();
  });

  it('(twitter card) should return mapped tags', function() {
    const graph = parse(require('./html.twitter-card'), {url: sUrl});

    expect(graph).toBeA('object');
    expect(graph).toIncludeKeys(['title', 'description', 'url', 'image']);
    expect(graph.image).toBeA('array');
    expect(graph.image[0]).toIncludeKey('url');
  });

  it('(no array) should implicitly create an array property', function() {
    const graph = parse(
      require('./html.no-arrays'),
      {url: sUrl}
    );

    expect(graph.image).toBeA('array');
    expect(graph.image.length).toBe(1);
    expect(graph.image[0]).toIncludeKeys(
      ['url', 'width', 'height', 'secure_url', 'type']
    );

    expect(graph.video).toBeA('array');
    expect(graph.video.length).toBe(2);
    expect(graph.video[0]).toIncludeKeys(
      ['url', 'secure_url', 'type', 'width', 'height']
    );

  });
});
