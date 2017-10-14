## request-url-open-graph
[![Build status](https://img.shields.io/travis/fupslot/request-url-open-graph/master.svg?style=flat)](https://travis-ci.org/fupslot/request-url-open-graph)

Returns an [open graph protocol](http://ogp.me/) for a web page.


# Support

- [Open Graph (Facebook)](https://developers.facebook.com/docs/sharing/webmasters#markup)
- [Twitter Card Tags](https://dev.twitter.com/cards/markup)

# Getting started

## Install

```bash
npm i request-url-open-graph --save
```

or 

```bash
npm install request-url-open-graph -g
```

## Get Open Graph

### URL


```javascript
const urlOpenGraph = require('request-url-open-graph');

urlOpenGraph({url: 'http://bit.ly/2gR95sb'}, (oError, oTags) => {
	console.log(oTags)
});
```

### HTML Content

```javascript
const urlOpenGraph = require('request-url-open-graph');

urlOpenGraph({contentHTML: '<html>...</html>'}, (oError, oTags) => {
	console.log(oTags)
});
```

## CLI

You can view Open Graph without leaving the terminal.


```bash
request-url-open-graph fetch --url=http://bit.ly/2hpP7rY
```

Result

```json
{
  "description": "I remember when I, a few months ago, needed to learn how to write JavaScript web applications using Express, NodeJS and PostgreSQL as my...",
  "card": "summary_large_image",
  "site": "@scotch_io",
  "creator": "",
  "title": "Getting Started with Node, Express and Postgres Using Sequelize",
  "url": "https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize",
  "type": "article",
  "image": [
    {
      "url": "https://scotch.io/wp-content/uploads/2016/12/nrMHOlRR6imGBoKkDZLJ_getting-started-with-node-express-postgres-sequelize.png.jpg"
    }
  ]
}
```