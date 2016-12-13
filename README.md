## request-url-open-graph
Returns an [open graph protocol](http://ogp.me/) for a web page.


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