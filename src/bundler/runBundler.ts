import type { EntryPoint } from '@account-abstraction/contracts';
import { EntryPoint__factory } from '@account-abstraction/contracts';
import type { JsonRpcProvider } from '@ethersproject/providers';
import { Command } from 'commander';
import type { Signer } from 'ethers';
import { ethers, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import fs from 'fs';

import { bundlerConfigDefault } from './BundlerConfig';
import { BundlerServer } from './BundlerServer';
import { resolveConfiguration } from './Config';
import { DebugMethodHandler } from './DebugMethodHandler';
import { initServer } from './modules/initServer';
import { UserOpMethodHandler } from './UserOpMethodHandler';
import { DeterministicDeployer } from '../sdk';
import { erc4337RuntimeVersion, RpcError, supportsRpcMethod } from '../utils';
import { supportsDebugTraceCall } from '../validation-manager';

// this is done so that console.log outputs BigNumber as hex string instead of unreadable object
export const inspectCustomSymbol = Symbol.for('nodejs.util.inspect.custom');
// @ts-ignore
ethers.BigNumber.prototype[inspectCustomSymbol] = function () {
  return `BigNumber ${parseInt(this._hex)}`;
};

const CONFIG_FILE_NAME = 'workdir/bundler.config.json';

export let showStackTraces = false;

/**
 *
 * @param wallet
 * @param entryPointAddress
 */
export async function connectContracts(
  wallet: Signer,
  entryPointAddress: string,
): Promise<{ entryPoint: EntryPoint }> {
  const entryPoint = EntryPoint__factory.connect(entryPointAddress, wallet);
  return {
    entryPoint,
  };
}

/**
 * Start the bundler server.
 * @param options - Options for the bundler server.
 * @param options.configFile - Path to the config file.
 * @param options.unsafe - Whether to disable additional validations requiring the RPC debug methods.
 * @returns The bundler server instance.
 */
export async function startBundler({
  configFile,
  unsafe,
}: {
  configFile: string;
  unsafe?: boolean;
}): Promise<BundlerServer> {
  const args = [
    '-',
    '-',
    unsafe ? '--unsafe' : undefined,
    '--config',
    configFile,
  ].filter((arg) => arg !== undefined) as string[];

  return await runBundler(args);
}

/**
 * start the bundler server.
 * this is an async method, but only to resolve configuration. after it returns, the server is only active after asyncInit()
 * @param argv
 * @param overrideExit
 */
export async function runBundler(
  argv: string[],
  overrideExit = true,
): Promise<BundlerServer> {
  const program = new Command();

  if (overrideExit) {
    (program as any)._exit = (exitCode: any, code: any, message: any) => {
      class CommandError extends Error {
        constructor(
          message: string,
          readonly code: any,
          readonly exitCode: any,
        ) {
          super(message);
        }
      }

      throw new CommandError(message, code, exitCode);
    };
  }

  program
    .version(erc4337RuntimeVersion)
    .option('--beneficiary <string>', 'address to receive funds')
    .option('--gasFactor <number>')
    .option(
      '--minBalance <number>',
      'below this signer balance, keep fee for itself, ignoring "beneficiary" address ',
    )
    .option('--network <string>', 'network name or url')
    .option('--mnemonic <file>', 'mnemonic/private-key file of signer account')
    .option(
      '--entryPoint <string>',
      'address of the supported EntryPoint contract',
    )
    .option(
      '--port <number>',
      `server listening port (default: ${bundlerConfigDefault.port})`,
    )
    .option('--config <string>', 'path to config file', CONFIG_FILE_NAME)
    .option(
      '--auto',
      'automatic bundling (bypass config.autoBundleMempoolSize)',
      false,
    )
    .option(
      '--unsafe',
      'UNSAFE mode: no storage or opcode checks (safe mode requires geth)',
    )
    .option(
      '--debugRpc',
      'enable debug rpc methods (auto-enabled for test node',
    )
    .option('--conditionalRpc', 'Use eth_sendRawTransactionConditional RPC)')
    .option('--show-stack-traces', 'Show stack traces.')
    .option('--createMnemonic <file>', 'create the mnemonic file');

  const programOpts = program.parse(argv).opts();
  showStackTraces = programOpts.showStackTraces;

  console.log('command-line arguments: ', program.opts());

  if (programOpts.createMnemonic != null) {
    const mnemonicFile: string = programOpts.createMnemonic;
    console.log('Creating mnemonic in file', mnemonicFile);
    if (fs.existsSync(mnemonicFile)) {
      throw new Error(
        `Can't --createMnemonic: out file ${mnemonicFile} already exists`,
      );
    }
    const newMnemonic = Wallet.createRandom().mnemonic.phrase;
    fs.writeFileSync(mnemonicFile, newMnemonic);
    console.log('created mnemonic file', mnemonicFile);
    process.exit(1);
  }
  const { config, provider, wallet } = await resolveConfiguration(programOpts);

  const {
    // name: chainName,
    chainId,
  } = await provider.getNetwork();

  if (chainId === 31337) {
    if (config.debugRpc == null) {
      console.log('== debugrpc was', config.debugRpc);
      config.debugRpc = true;
    } else {
      console.log('== debugrpc already st', config.debugRpc);
    }
    await new DeterministicDeployer(provider as any).deterministicDeploy(
      EntryPoint__factory.bytecode,
    );
    if ((await wallet.getBalance()).eq(0)) {
      console.log('=== testnet: fund signer');
      const signer = (provider as JsonRpcProvider).getSigner();
      await signer.sendTransaction({
        to: await wallet.getAddress(),
        value: parseEther('1'),
      });
    }
  }

  if (
    config.conditionalRpc &&
    !(await supportsRpcMethod(
      provider as any,
      'eth_sendRawTransactionConditional',
      [{}, {}],
    ))
  ) {
    console.error(
      'FATAL: --conditionalRpc requires a node that support eth_sendRawTransactionConditional',
    );
    process.exit(1);
  }
  if (!config.unsafe && !(await supportsDebugTraceCall(provider as any))) {
    console.error(
      'FATAL: full validation requires a node with debug_traceCall. for local UNSAFE mode: use --unsafe',
    );
    process.exit(1);
  }

  const { entryPoint } = await connectContracts(wallet, config.entryPoint);

  // bundleSize=1 replicate current immediate bundling mode
  const execManagerConfig = {
    ...config,
    // autoBundleMempoolSize: 0
  };
  if (programOpts.auto === true) {
    execManagerConfig.autoBundleMempoolSize = 0;
    execManagerConfig.autoBundleInterval = 0;
  }

  const [execManager, eventsManager, reputationManager, mempoolManager] =
    initServer(execManagerConfig, entryPoint.signer);
  const methodHandler = new UserOpMethodHandler(
    execManager,
    provider,
    wallet,
    config,
    entryPoint,
  );
  eventsManager.initEventListener();
  const debugHandler =
    config.debugRpc ?? false
      ? new DebugMethodHandler(
          execManager,
          eventsManager,
          reputationManager,
          mempoolManager,
        )
      : (new Proxy(
          {},
          {
            get(target: {}, method: string, receiver: any): any {
              throw new RpcError(
                `method debug_bundler_${method} is not supported`,
                -32601,
              );
            },
          },
        ) as DebugMethodHandler);

  const bundlerServer = new BundlerServer(
    methodHandler,
    debugHandler,
    config,
    provider,
    wallet,
  );

  void bundlerServer.asyncStart().then(async () => {
    console.log(
      'Bundle interval (seconds)',
      execManagerConfig.autoBundleInterval,
    );
    console.log(
      'connected to network',
      await provider.getNetwork().then((net) => {
        return {
          name: net.name,
          chainId: net.chainId,
        };
      }),
    );
    console.log(`running on http://localhost:${config.port}/rpc`);
  });

  return bundlerServer;
}
