'use strict';

const debug = require('debug');

class Debug {
  static context(ctx) {
    if (ctx && typeof ctx === 'function') { // assume we have a constructor
      ctx = ctx.name;
    } else if (ctx && typeof ctx === 'object' && typeof ctx.constructor === 'function') { // assume we have an object
      ctx = ctx.constructor.name;
    }

    const prop = `__ctx__${ ctx }`;

    if (!this.hasOwnProperty(prop)) {
      this[prop] = debug(ctx);
    }

    return this[prop];
  }
}

module.exports = Debug;
