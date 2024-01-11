import type { JsonRpcProvider } from '@ethersproject/providers';

import { bundlerCollectorTracer } from './BundlerCollectorTracer';
import { debug_traceCall } from './GethTracer';
import type { ValidateUserOpResult } from './ValidationManager';
import { ValidationManager } from './ValidationManager';
import { IEntryPoint__factory } from '../contract-types';
import { AddressZero } from '../utils';
import type { UserOperation } from '../utils';

export * from './ValidationManager';

/**
 *
 * @param provider
 */
export async function supportsDebugTraceCall(
  provider: JsonRpcProvider,
): Promise<boolean> {
  const p = provider.send as any;
  if (p._clientVersion == null) {
    p._clientVersion = await provider.send('web3_clientVersion', []);
  }

  // make sure we can trace a call.
  const ret = await debug_traceCall(
    provider,
    { from: AddressZero, to: AddressZero, data: '0x' },
    { tracer: bundlerCollectorTracer },
  ).catch((e) => e);
  return ret.logs != null;
}

/**
 *
 * @param provider
 * @param userOperation
 * @param entryPointAddress
 */
export async function checkRulesViolations(
  provider: JsonRpcProvider,
  userOperation: UserOperation,
  entryPointAddress: string,
): Promise<ValidateUserOpResult> {
  const supportsTrace = await supportsDebugTraceCall(provider);
  if (!supportsTrace) {
    throw new Error('This provider does not support stack tracing');
  }
  const entryPoint = IEntryPoint__factory.connect(entryPointAddress, provider);
  const validationManager = new ValidationManager(entryPoint, false);
  return await validationManager.validateUserOp(userOperation);
}
