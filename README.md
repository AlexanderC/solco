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

> To flatten the contract for verification on Etherscan use `--verifyable` option
> to enable `Truffle` compatibility mode.

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

## Roadmap

- [ ] Add logo and badges
- [ ] Write tests
- [ ] Add more commands
- [ ] Add more documentation

## Support development

I really love open source, however i do need your help to
keep the library up to date. There are several ways to do it:
open issues, submit PRs, share the library w/ community or simply-

<a href="https://etherdonation.com/d?to=0x4a1eade6b3780b50582344c162a547d04e4e8e4a" target="_blank" title="Donate ETH"><img src="https://etherdonation.com/i/btn/donate-btn.png" alt="Donate ETH"/></a>
