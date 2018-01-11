'use strict';

const fs = require('fs-extra');
const path = require('path');

class Combine {
  constructor(metadata = {}) {
    this.metadata = metadata;
  }

  generateOutFile(inFile) {
    const dirname = path.dirname(inFile);
    const basename = path.basename(inFile, Combine.CONTRACT_EXTENSION);

    return path.join(
      dirname, 
      `${ basename }${ Combine.COMBINED_CONTRACT_EXTENSION }`
    );
  }

  combineAndDump(contracts, outFile) {
    return this.combine(contracts)
      .then(data => {
        return fs.writeFile(outFile, data)
          .then(() => ({ outFile, data }));
      });
  }

  combine(contracts) {
    return Promise.all(contracts.map(c => fs.readFile(c)))
      .then(contents => contents.map(c => this._cleanup(c)))
      .then(contents => {
        let out = '';

        for (let i in contents) {
          out += '/**\n';
          out += ` * Extracted from ${ contracts[i] }\n *\n`;
          out += Object.keys(this.metadata)
            .map(k => ` * @${ k }\t${ this.metadata[k] }`).join('\n');
          out += '\n */\n\n';
          out += contents[i];
          out += '\n\n';
        }

        return out;
      });
  }

  _cleanup(content) {
    return content
      .toString()
      .split('\n')
      .filter(line => (
        !Combine.IMPORT_REGEX.test(line) && // remove pragma lines
        !Combine.PRAGMA_REGEX.test(line) // remove import lines
      ))
      .join('\n')
      .trim();
  }

  static get COMBINED_CONTRACT_EXTENSION() {
    return `.build${ this.CONTRACT_EXTENSION }`;
  }

  static get CONTRACT_EXTENSION() {
    return '.sol';
  }

  static get IMPORT_REGEX() {
    return /^import/;
  }

  static get PRAGMA_REGEX() {
    return /^pragma solidity \^{0,1}(\d{1,2}\.\d{1,2}\.\d{1,3})/;
  }
}

module.exports = Combine;
