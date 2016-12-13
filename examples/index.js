'use strict';
const requestUrlOpenGraph = require('../');

// Shorten URLs
// http://tinyurl.com/jcln2o2
// https://goo.gl/sKXWhn
// http://bit.ly/2hkWfpP
// http://bit.ly/2gR95sb


requestUrlOpenGraph(
  {
    url: process.argv[2]
  },
  (oError, oTags) => {
    if (oError) {
      console.log(oError);
      process.exit(1);
    } else {
      console.log(JSON.stringify(oTags, undefined, 2));
      process.exit(0);
    }
  }
);
