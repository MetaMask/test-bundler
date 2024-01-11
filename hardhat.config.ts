import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';

import fs from 'fs';
import type { HardhatUserConfig } from 'hardhat/config';
import type { NetworkUserConfig } from 'hardhat/src/types/config';

const mnemonicFileName = process.env.MNEMONIC_FILE;
let mnemonic = `${'test '.repeat(11)}junk`;
if (mnemonicFileName != null && fs.existsSync(mnemonicFileName)) {
  mnemonic = fs.readFileSync(mnemonicFileName, 'ascii').trim();
}

const infuraUrl = (name: string): string =>
  `https://${name}.infura.io/v3/${process.env.INFURA_ID}`;

/**
 *
 * @param url
 */
function getNetwork(url: string): NetworkUserConfig {
  return {
    url,
    accounts: {
      mnemonic,
    },
  };
}

/**
 *
 * @param name
 */
function getInfuraNetwork(name: string): NetworkUserConfig {
  return getNetwork(infuraUrl(name));
}

const config: HardhatUserConfig = {
  paths: {
    sources: 'src/contracts',
  },
  typechain: {
    outDir: 'src/contract-types',
    target: 'ethers-v5',
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545/',
      saveDeployments: false,
    },
    goerli: getInfuraNetwork('goerli'),
  },
  solidity: {
    version: '0.8.15',
    settings: {
      optimizer: { enabled: true },
    },
  },
};

export default config;
