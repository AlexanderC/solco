#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const Resolver = require('./src/resolver');
const Debug = require('./src/debug');
const Combine = require('./src/combine');
const pkg = require('./package.json');
const Format = require('./src/format');
const Analyze = require('./src/analyze');

yargs
  .command({
    command: 'analyze <contract>',
    aliases: [ 'an' ],
    desc: 'Analyze a contract',
    builder: yargs => {
      return yargs
        .option('recursive', {
          alias: 'r',
          describe: 'Analyze contract dependencies',
          default: false,
        })
        .option('output', {
          alias: 'o',
          normalize: true,
          describe: 'Specify output file',
        })
        .option('format', {
          alias: 'f',
          describe: 'Specify output format',
          choices: Format.formats,
          default: Format.formats[0],
        })
        .positional('contract', {
          describe: 'Path to the contract file',
          normalize: true,
        });
    },
    handler: argv => {
      const resolver = new Resolver();
      const before = yargs.recursive 
        ? resolver.resolve(argv.contract) 
        : Promise.resolve([]);

      return before
        .then(dependencies => {
          if (yargs.recursive) {
            Debug.context(resolver)(dependencies);

            console.info(chalk.green(
              `Detected ${ dependencies.length } dependencies in '${ argv.contract }'`
            ));
          }
          
          return [ path.resolve(argv.contract) ].concat(dependencies);
        })
        .then(contracts => {
          console.info(chalk.green(
            `Analyzing ${ contracts.length } contract[s]`
          ));

          const analyze = new Analyze();

          return Promise.all(contracts.map(c => analyze.analyze(c)))
            .then(reports => {
              const report = {};

              for (let i in reports) {
                report[contracts[i]] = reports[i];

                Debug.context(analyze)(contracts[i], reports[i]);
              }

              return report;
            });
        })
        .then(report => {
          report = Format[argv.format](report);

          if (argv.output) {
            console.info(chalk.green(
              `Report dumped into '${ argv.output }' (${ new Buffer(report).length } bytes)`
            ));

            return fs.writeFile(argv.output, report);
          }

          process.stdout.write(`\n${ report }\n`);
        });
    },
  })
  .command({
    command: 'combine <contract>',
    aliases: [ 'com', 'cb' ],
    desc: 'Combine contract dependencies in one file',
    builder: yargs => {
      return yargs
        .option('output', {
          alias: 'o',
          normalize: true,
          describe: 'Specify output file',
        })
        .positional('contract', {
          describe: 'Path to the contract file',
          normalize: true,
        });
    },
    handler: argv => {
      const resolver = new Resolver();

      return resolver.resolve(argv.contract)
        .then(dependencies => {
          Debug.context(resolver)(dependencies);

          console.info(chalk.green(
            `Detected ${ dependencies.length } dependencies in '${ argv.contract }'`
          ));

          const { name, version } = pkg;

          const combine = new Combine({ name, version, date: new Date().toISOString() });
          const contracts = [].concat(dependencies);

          contracts.push(path.resolve(argv.contract));

          const outFile = argv.output || combine.generateOutFile(argv.contract);

          Debug.context(combine)(outFile);

          return combine.combineAndDump(contracts, outFile);
        })
        .then(result => {
          const { outFile, data } = result;

          console.info(chalk.green(
            `Successfully written ${ new Buffer(data).length } bytes into '${ outFile }'`
          ));
        });
    },
  })
  .command({
    command: '$0',
    handler: () =>  console.info(
      chalk.green('Use'),
      chalk.blue('--help'),
      chalk.green('to see usage options')
    ),
  })
  .fail((msg, error) => {
    if (error) {
      Debug.context(Error)(error);
    }
    console.error(chalk.red(msg || error.message));
    process.exit(1);
  })
  .help('h')
  .alias('h', 'help')
  .epilog(pkg.epilog)
  .argv;
