'use strict';

const fs = require('fs-extra');
const solgraph = require('solgraph/dist/index').default;

class Visualize {
  visualize(contract, compact = false) {
    return fs.readFile(contract)
      .then(content => this.visualizeContract(content, compact));
  }

  visualizeContract(content, compact = false) {    
    try {
      let graph = solgraph(content.toString());

      if (compact) {
        graph = graph.trim().split('\n');
        graph.shift();
        graph.pop();
        graph = graph.join('\n');
      }

      return Promise.resolve(graph);
    } catch (error) {
      if (error.name === 'SyntaxError') {
        return Promise.reject(new Error(
          `Failed to parse contract: ${ error.message }\nin\n` +
          `${ Visualize._extractSyntaxErrorCode(error, content) }`
        ));
      }

      return Promise.reject(error);
    }
  }

  static _extractSyntaxErrorCode(error, content) {
    let code = 'N/A';

    if (error.location && error.location.start && error.location.end) {
      code = '';
      let currentLine = error.location.start.line;
      const parts = content.split('\n');

      do {
        code += `[${ currentLine }] ${ parts[currentLine] }`;
        currentLine++;
      } while (currentLine < error.location.end.line);

      const point = content.substr(
        error.location.start.offset,
        error.location.end.offset - error.location.start.offset
      );
      code += `'\nat (${ error.location.start.offset }:${ error.location.end.offset }): ${ point }`;
    }

    return code;
  }
}

module.exports = Visualize;
