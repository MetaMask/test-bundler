import type { BaseProvider } from '@ethersproject/providers';
import { JsonRpcProvider } from '@ethersproject/providers';
import type { Signer } from 'ethers';
import { Wallet } from 'ethers';
import fs from 'fs';
import ow from 'ow';

import type { BundlerConfig } from './BundlerConfig';
import { bundlerConfigDefault, BundlerConfigShape } from './BundlerConfig';

/**
 *
 * @param programOpts
 */
function getCommandLineParams(programOpts: any): Partial<BundlerConfig> {
  const params: any = {};
  for (const bundlerConfigShapeKey in BundlerConfigShape) {
    const optionValue = programOpts[bundlerConfigShapeKey];
    if (optionValue != null) {
      params[bundlerConfigShapeKey] = optionValue;
    }
  }
  return params as BundlerConfig;
}

/**
 *
 * @param sources
 */
function mergeConfigs(...sources: Partial<BundlerConfig>[]): BundlerConfig {
  const mergedConfig = Object.assign({}, ...sources) as BundlerConfig;
  ow(mergedConfig, ow.object.exactShape(BundlerConfigShape));
  return mergedConfig;
}

const DEFAULT_INFURA_ID = 'd442d82a1ab34327a7126a578428dfc4';

/**
 *
 * @param url
 */
export function getNetworkProvider(url: string): JsonRpcProvider {
  if (url.match(/^[\w-]+$/) != null) {
    const infuraId = process.env.INFURA_ID1 ?? DEFAULT_INFURA_ID;
    url = `https://${url}.infura.io/v3/${infuraId}`;
  }
  console.log('url=', url);
  return new JsonRpcProvider(url);
}

/**
 *
 * @param programOpts
 */
export async function resolveConfiguration(
  programOpts: any,
): Promise<{ config: BundlerConfig; provider: BaseProvider; wallet: Signer }> {
  const commandLineParams = getCommandLineParams(programOpts);
  let fileConfig: Partial<BundlerConfig> = {};
  const configFileName = programOpts.config;
  if (fs.existsSync(configFileName)) {
    fileConfig = JSON.parse(fs.readFileSync(configFileName, 'ascii'));
  }
  const config = mergeConfigs(
    bundlerConfigDefault,
    fileConfig,
    commandLineParams,
  );
  console.log('Merged configuration:', JSON.stringify(config));

  if (config.network === 'hardhat') {
    // eslint-disable-next-line
    const provider: JsonRpcProvider = require('hardhat').ethers.provider
    return { config, provider, wallet: provider.getSigner() };
  }

  const provider: BaseProvider = getNetworkProvider(config.network);
  let mnemonic: string;
  let wallet: Wallet;
  try {
    mnemonic = fs.readFileSync(config.mnemonic, 'ascii').trim();
    wallet = Wallet.fromMnemonic(mnemonic).connect(provider);
  } catch (e: any) {
    throw new Error(
      `Unable to read --mnemonic ${config.mnemonic}: ${e.message as string}`,
    );
  }
  return { config, provider, wallet };
}
