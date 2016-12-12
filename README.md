## request-url-open-graph
Returns an [open graph protocol](http://ogp.me/) for a web page.

Note: This module does not support Open Graph Arrays yet. Which means, if a web page has more that one reference to an image o video, only the last one will be return. I'm working on it ;)

### Support

- [Open Graph (Facebook)](https://developers.facebook.com/docs/sharing/webmasters#markup)
- [Twitter Card Tags](https://dev.twitter.com/cards/markup)

### Getting started

#### Install

```bash
npm i request-url-open-graph --save
```

### Examples

#### Common use case

```javascript
const urlOpenGraph = require('request-url-open-graph');

urlOpenGraph({url: 'http://bit.ly/2gR95sb'}, (oError, oTags) => {
	console.log(oTags)
});
```