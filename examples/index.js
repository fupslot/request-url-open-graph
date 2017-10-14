const requestUrlOpenGraph = require('../');
const fs = require('fs');
const path = require('path');

// Shorten URLs
// http://tinyurl.com/jcln2o2
// https://goo.gl/sKXWhn
// http://bit.ly/2hkWfpP
// http://bit.ly/2gR95sb

// const url = 'https://medium.freecodecamp.org/we-fired-our-top-talent-best-decision-we-ever-made-4c0a99728fde';

const content = fs.readFileSync(path.resolve(__dirname, '../test/mock/no-arrays.html'), {
  encoding:'utf8'
});

requestUrlOpenGraph({contentHTML: content}, (oError, oTags) => {
  if (oError) {
    console.log(oError);
    process.exit(1);
  } else {
    console.log(JSON.stringify(oTags, undefined, 2));
    process.exit(0);
  }
});
