'use strict';
const expect = require('expect');
const pkg = require('../package.json');
const parse = require('../util/parse');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logger = new winston.Logger({
  transports: [ new winston.transports.Console() ]
});

const sUrl = 'https://www.example.com/index.html';

describe(`${pkg.name}`, function() {

  it('parse open graph', function() {
    const content = fs.readFileSync(path.resolve(__dirname, 'mock/basic.html'), {
      encoding:'utf8'
    });

    const graph = parse(content, { url: 'mocked' });
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
    const content = fs.readFileSync(path.resolve(__dirname, 'mock/basic.html'), {
      encoding:'utf8'
    });

    const graph = parse(content, { url: 'mocked' });

    expect(graph).toBeA('object');
    expect(graph.title).toExist();
    expect(graph.url).toExist();
  });

  it('(twitter card) should return mapped tags', function() {
    const content = fs.readFileSync(path.resolve(__dirname, 'mock/basic.html'), {
      encoding:'utf8'
    });

    const graph = parse(content, { url: 'mocked' });

    expect(graph).toBeA('object');
    expect(graph).toIncludeKeys(['title', 'description', 'url', 'image']);
    expect(graph.image).toBeA('array');
    expect(graph.image[0]).toIncludeKey('url');
  });

  it('(no array) should implicitly create an array property', function() {
    const content = fs.readFileSync(path.resolve(__dirname, 'mock/no-arrays.html'), {
      encoding:'utf8'
    });
    
    const graph = parse(content, { url: 'mocked' });

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

  it('support [rel=image_src]', function() {
    const content = fs.readFileSync(path.resolve(__dirname, 'mock/rel-image_src.html'), {
      encoding:'utf8'
    });
    
    const graph = parse(content, { url: 'mocked' });
    expect(graph.image.length).toEqual(2);
    expect(graph.image[0].url).toNotEqual(graph.image[1].url);
  });
});
