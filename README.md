# solco - Solidity smart contracts utility

`solco` is your smart contracts companion.

## Prerequisites

- NodeJS >=6.x
- MacOS/Linux

## Installation

```bash
npm install -g solco
```

## Usage

Help output:

```bash
alexc@MacBook-Pro:~/Desktop/Projects/solco$ solco --help
solco

Commands:
  solco visualize <contract>  Visualize contract's control flow
                                                              [aliases: viz, vz]
  solco analyze <contract>    Analyze a contract                [aliases: an]
  solco combine <contract>    Combine contract dependencies in one file
                                                              [aliases: com, cb]
  solco profile <contract>    Profile a smart contract    [aliases: prof, pr]

Options:
  --version   Show version number                                      [boolean]
  -h, --help  Show help                                                [boolean]

Made w/ ❤ by AlexanderC <alexander.moldova@gmail.com>

```

Combine contracts:

```bash
solco combine ./contracts/AwesomeToken.sol
```

Analyze contract:

```bash
solco analyze ./contracts/AwesomeToken.sol
```

Visualize contract:

```bash
solco visualize ./contracts/AwesomeToken.sol
```

Profile contract:

```bash
solco profile ./contracts/AwesomeToken.sol
```

> Every command have their own `--help` containing usage information

Debugging:

```bash
DEBUG=* solco visualize ./contracts/AwesomeToken.sol
DEBUG=Resolver solco visualize ./contracts/AwesomeToken.sol
```

> More info on `debug` usage you can find [here](https://www.npmjs.com/package/debug)

## Roadmap:

- [ ] Add logo and badges
- [ ] Write tests
- [ ] Add more commands
- [ ] Add more documentation 
