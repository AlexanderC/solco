'use strict';

const asciiTable = require('ascii-table');
const SolidityParser = require('solidity-parser');

class Profile {
  static tableFromInterface(title, contractInterface) {
    const table = new asciiTable(title);

    table.setHeading('Contract', 'Function', 'Visibility', 'Constant', 'Returns', 'Modifiers');

    for (let row of contractInterface) {
      table.addRow(row.contract, row.function, row.visibility, row.constant, row.returns, row.modifiers);
    }

    return table;
  }

  processFile(contractFile) {
    return this.getInterface(SolidityParser.parseFile(contractFile));
  }

  process(contractData) {
    return this.getInterface(SolidityParser.parse(contractData));
  }

  getInterface(contract) {
    const contractInterface = [];

    for (let item of contract.body) {
      if (item.type === 'ContractStatement') {
        for (let part of item.body) {
          if (part.type === 'FunctionDeclaration' && !part.is_abstract) {
            contractInterface.push(this._parseFunctionPart(item, part));
          }
        }
      }
    }

    return contractInterface;
  }

  _parseFunctionPart(contract, part) {
    const contractName = contract.name;
    let funcName = part.name || '';
    const params = [];

    if (part.params) {
      for (let param of part.params) {
        params.push(param.literal.literal);
      }

      funcName += `(${ params.join(', ') })`;
    } else {
      funcName += '()';
    }

    let visibility = 'public';
    let isConstant = false;
    const returns = [];
    const custom = [];

    if (part.returnParams) {
      for (let param of part.returnParams) {
        returns.push(param.literal.literal);
      }
    }

    if (part.modifiers) {
      for (let mod of part.modifiers) {
        switch (mod.name) {
          case 'public':
            break;
          case 'private':
            visibility = 'private';
            break;
          case 'internal':
            visibility = 'internal';
            break;
          case 'external':
            visibility = 'external';
            break;
          case 'constant':
            isConstant = true;
            break;
          default:
            custom.push(mod.name);
        } 
      }
    }

    return {
      contract: contractName,
      function: funcName,
      visibility: visibility,
      constant: isConstant,
      returns: returns.join(', '),
      modifiers: custom.join(', '),
    };
  }
}

module.exports = Profile;
