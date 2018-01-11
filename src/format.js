'use strict';

const treeify = require('treeify');

class Format {
  static get formats() {
    return [ 'txt', 'json' ];
  }

  static txt(data) {
    const heading = `Analysis on ${ new Date().toISOString() }`;

    return [ heading, treeify.asTree(data, true) ].join('\n');
  }

  static json(data) {
    return JSON.stringify(data, null, '  ');
  }
}

module.exports = Format;
