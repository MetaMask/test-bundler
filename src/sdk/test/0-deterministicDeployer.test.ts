import { expect } from 'chai';
import { hexValue } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

import { SampleRecipient__factory } from '../../contract-types';
import { DeterministicDeployer } from '../DeterministicDeployer';

const deployer = new DeterministicDeployer(ethers.provider);

describe('#deterministicDeployer', () => {
  it('deploy deployer', async () => {
    expect(await deployer.isDeployerDeployed()).to.equal(false);
    await deployer.deployFactory();
    expect(await deployer.isDeployerDeployed()).to.equal(true);
  });
  it('should ignore deploy again of deployer', async () => {
    await deployer.deployFactory();
  });
  it('should deploy at given address', async () => {
    const ctr = hexValue(
      new SampleRecipient__factory(
        ethers.provider.getSigner(),
      ).getDeployTransaction().data!,
    );
    DeterministicDeployer.init(ethers.provider);
    const addr = await DeterministicDeployer.getAddress(ctr);
    expect(await deployer.isContractDeployed(addr)).to.equal(false);
    await DeterministicDeployer.deploy(ctr);
    expect(await deployer.isContractDeployed(addr)).to.equal(true);
  });
});
