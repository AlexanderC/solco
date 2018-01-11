'use strict';

const path = require('path');
const resolveFrom = require('resolve-from');
const SolidityParser = require('solidity-parser');

class Resolver {
  resolve(file, recursive = true, skip = []) {
    try {
      file = path.resolve(file);

      if (skip.indexOf(file) !== -1) {
        return Promise.resolve([]);
      }
      
      skip.push(file);

      const imports = (SolidityParser.parseFile(file, 'imports') || [])
        .map(x => this._normalizeDependency(file, x));

      if (!recursive) {
        return Promise.resolve(imports);
      }

      return Promise.all(imports.map(x => this.resolve(x, recursive, skip)))
        .then(results => [ ...new Set(imports.concat(...results)) ]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  _normalizeDependency(file, dependency) {
    try {
      return resolveFrom(path.dirname(file), dependency);
    } catch (error) {
      throw new Error(
        `(in ${ file })\n  Unable to resolve '${ dependency }' dependency`
      );
    }
  }
}

module.exports = Resolver;
