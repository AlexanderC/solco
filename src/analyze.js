'use strict';

const fs = require('fs-extra');
const solc = require('solc');
const solium = require('solium');
const Resolver = require('./resolver');

class Analyze {
  constructor(config) {
    this.config = config;
  }

  analyze(contract, dependencies) {
    return fs.readFile(contract)
      .then(content => {
        const sources = {};
        sources[contract] = content.toString();
        
        const data = solc.compile(
          { sources }, 
          0, // do not optimize 
          dependency => {
            try {
              const file = Resolver.resolveDependency(contract, dependency);

              return { contents: fs.readFileSync(file).toString() };
            } catch (error) {
              return { error };
            }
          }
        );

        let soliumErrors, solcErrors;

        solcErrors = (data.errors || []).map(e => Analyze._normalizeSolcError(e));

        try {
          soliumErrors = solium.lint(content, this.config.solium)
            .map(e => Analyze._normalizeSoliumError(e));
        } catch (error) {
          soliumErrors = [ error ];
        }

        return {
          solc: { errors: solcErrors },
          solium: { errors: soliumErrors },
        };
      });
  }

  static _normalizeSolcError(error) {
    return error.replace(/\n/g, ' ');
  }

  static _normalizeSoliumError(error) {
    let { ruleName, message, line, column, node } = error;

    if (node && node.from) {
      message = message.substr(node.from.length + 3);
    }

    return `[${ ruleName } : ${ line }/${ column }] ${ message }`;
  }
}

module.exports = Analyze;
