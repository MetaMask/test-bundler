import type {
  SimpleAccount,
  SimpleAccountFactory,
} from '@account-abstraction/contracts';
import {
  SimpleAccount__factory,
  SimpleAccountFactory__factory,
} from '@account-abstraction/contracts';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumberish } from 'ethers';
import { BigNumber } from 'ethers';
import { arrayify, hexConcat } from 'ethers/lib/utils';

import type { BaseApiParams } from './BaseAccountAPI';
import { BaseAccountAPI } from './BaseAccountAPI';

/**
 * constructor params, added no top of base params:
 * @param owner - the signer object for the account owner
 * @param factoryAddress - address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index - nonce value used when creating multiple accounts for the same owner
 */
export type SimpleAccountApiParams = {
  owner: Signer;
  factoryAddress?: string;
  index?: BigNumberish;
} & BaseApiParams;

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class SimpleAccountAPI extends BaseAccountAPI {
  factoryAddress?: string;

  owner: Signer;

  index: BigNumberish;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: SimpleAccount;

  factory?: SimpleAccountFactory;

  constructor(params: SimpleAccountApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.owner = params.owner;
    this.index = BigNumber.from(params.index ?? 0);
  }

  async _getAccountContract(): Promise<SimpleAccount> {
    if (this.accountContract == null) {
      this.accountContract = SimpleAccount__factory.connect(
        await this.getAccountAddress(),
        this.provider,
      );
    }
    return this.accountContract;
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = SimpleAccountFactory__factory.connect(
          this.factoryAddress,
          this.provider,
        );
      } else {
        throw new Error('no factory to get initCode');
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('createAccount', [
        await this.owner.getAddress(),
        this.index,
      ]),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    return await accountContract.getNonce();
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('execute', [
      target,
      value,
      data,
    ]);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.owner.signMessage(arrayify(userOpHash));
  }
}
