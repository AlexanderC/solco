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
        .map(x => Resolver.resolveDependency(file, x));

      if (!recursive) {
        return Promise.resolve(imports);
      }

      return Promise.all(imports.map(x => this.resolve(x, recursive, skip)))
        .then(results => [ ...new Set(imports.concat(...results)) ]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static resolveDependency(sourceFile, dependency) {
    try {
      return resolveFrom(path.dirname(sourceFile), dependency);
    } catch (error) {
      throw new Error(
        `(in ${ sourceFile })\n  Unable to resolve '${ dependency }' dependency`
      );
    }
  }
}

module.exports = Resolver;
