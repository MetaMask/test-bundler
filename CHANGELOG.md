# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0]

### Uncategorized

- Remove documentation workflows ([#6](https://github.com/MetaMask/test-bundler/pull/6))
- Emit user operation hash in event
- Update codeowners
- Update title
- Fix readme
- Update readme
- Remove unnecessary dependencies
- Fix linting errors
- Update license
- Use metamask module template
- Update readme
- Fix linting and depcheck
- Remove automatic debug RPC for local chain
- Convert monorepo to single package
- add process signal handlers and specify package manager version ([#170](https://github.com/MetaMask/test-bundler/pull/170))
- fix lint.. ([#166](https://github.com/MetaMask/test-bundler/pull/166))
- fix checkRulesCoverage ([#158](https://github.com/MetaMask/test-bundler/pull/158))
- bundler: --debugRpc to enable "debug\_" rpc calls
- AA-213: Standalone ValidationManager package ([#153](https://github.com/MetaMask/test-bundler/pull/153))
- added checkRulesCoverage ([#155](https://github.com/MetaMask/test-bundler/pull/155))
- [STO-033]: staked entity have read-only access to any storage in non-entity contract. ([#156](https://github.com/MetaMask/test-bundler/pull/156))
- AA-205 reference validation rules by id ([#145](https://github.com/MetaMask/test-bundler/pull/145))
- SREP-010 add RPC debug API ([#152](https://github.com/MetaMask/test-bundler/pull/152))
- STO-040 rule check implementation ([#151](https://github.com/MetaMask/test-bundler/pull/151))
- Staked account rep ([#150](https://github.com/MetaMask/test-bundler/pull/150))
- Enforce entity reputation rules ([#149](https://github.com/MetaMask/test-bundler/pull/149))
- SSTORE reverts when gas left is below 2300 ([#148](https://github.com/MetaMask/test-bundler/pull/148))
- fix bignumber comparison ([#135](https://github.com/MetaMask/test-bundler/pull/135))
- bundler 0.6.1 ([#121](https://github.com/MetaMask/test-bundler/pull/121))
- AA-198: Support opcode sequences for access rules ([#142](https://github.com/MetaMask/test-bundler/pull/142))
- AA-192: fix 'yarn runop' command ([#141](https://github.com/MetaMask/test-bundler/pull/141))
- AA-190: restrict access to EntryPoint address ([#139](https://github.com/MetaMask/test-bundler/pull/139))
- AA-195: Define allowed precompiles instead of injected 'isPrecompiled' function ([#140](https://github.com/MetaMask/test-bundler/pull/140))
- AA-185: Check access of un-deployed zero code size addresses even for sender ([#138](https://github.com/MetaMask/test-bundler/pull/138))
- AA-182: Detect violation of rule "4.1 Must not use value" in the bundler ([#136](https://github.com/MetaMask/test-bundler/pull/136))
- fix: debug_bundler_clearState clears MempoolManager.entryCount ([#134](https://github.com/MetaMask/test-bundler/pull/134))
- Update entryPoint address. ([#130](https://github.com/MetaMask/test-bundler/pull/130))
- fix bundler check for "expire too soon" ([#129](https://github.com/MetaMask/test-bundler/pull/129))
- bugfix: estimateUserOperationGas gas values are overridden by the default values ([#119](https://github.com/MetaMask/test-bundler/pull/119))
- support jsonrpc batching ([#126](https://github.com/MetaMask/test-bundler/pull/126))
- unstaked paymaster can't use assoc. storage even if factory is staked
- rule fix: allow account to access associated storage if factory is staked ([#127](https://github.com/MetaMask/test-bundler/pull/127))
- use hardhat's provider's signer ([#114](https://github.com/MetaMask/test-bundler/pull/114))
- Fix --unsafe and --conditionalRpc tests ([#125](https://github.com/MetaMask/test-bundler/pull/125))
- vix typo: verificationGasLimit
- PR comments
- remove console.log
- stop collecting trace on "BeginExecution"
- lints
- fixed bundler-spec-test error "test_codehash_changed"
- remove marker. use top-level call signature
- Return 'calldata' check
- Simplify TestFakeWalletToken
- Remove state.sol
- Remove 'SimpleWallet'
- Add TypeScript test for AA-98 rule
- Imrpove log and make it 'debug'
- AA-98: Prevent bundling UserOps that access another UserOp's sender
- v0.6.0
- pkg cleanpup
- fix bundler --network ([#103](https://github.com/MetaMask/test-bundler/pull/103))
- fix slice size on tracer ([#102](https://github.com/MetaMask/test-bundler/pull/102))
- Fix return type of estimateUserOpGas ([#104](https://github.com/MetaMask/test-bundler/pull/104))
- Fix calculation for min amount of ops ([#101](https://github.com/MetaMask/test-bundler/pull/101))
- support v0.6.0 ([#95](https://github.com/MetaMask/test-bundler/pull/95))
- Api v0.5 ([#97](https://github.com/MetaMask/test-bundler/pull/97))
- Expose BaseAccountAPI for more flexibility on 4337 integration ([#98](https://github.com/MetaMask/test-bundler/pull/98))
- trivial typo ([#88](https://github.com/MetaMask/test-bundler/pull/88))
- Update README.md ([#92](https://github.com/MetaMask/test-bundler/pull/92))
- Handle exceptions within auto bundle thread ([#86](https://github.com/MetaMask/test-bundler/pull/86))
- Only wait for receipt if user requests it ([#76](https://github.com/MetaMask/test-bundler/pull/76))
- README: update usage ([#70](https://github.com/MetaMask/test-bundler/pull/70))
- script: update entry point address at runop-goerli ([#77](https://github.com/MetaMask/test-bundler/pull/77))
- README update and wallet nonce fixes ([#73](https://github.com/MetaMask/test-bundler/pull/73))
- Bundler sdk on goerli ([#64](https://github.com/MetaMask/test-bundler/pull/64))
- Adding requirement for bumping maxFeePerGas as well, similar to geth ([#68](https://github.com/MetaMask/test-bundler/pull/68))
- Replace userOp if gas increase equals 10% ([#62](https://github.com/MetaMask/test-bundler/pull/62))
- Added RANDOM and PREVRANDAO for banned opcodes ([#66](https://github.com/MetaMask/test-bundler/pull/66))
- Update to contracts v0.5.0 ([#61](https://github.com/MetaMask/test-bundler/pull/61))
- AA-153: remove UserOp from mempool only based on event ([#59](https://github.com/MetaMask/test-bundler/pull/59))
- support Conditional rpc ([#58](https://github.com/MetaMask/test-bundler/pull/58))
- remove pre-deployed BundlerHelper ([#57](https://github.com/MetaMask/test-bundler/pull/57))
- fix typo ([#53](https://github.com/MetaMask/test-bundler/pull/53))
- change code to be BOR-compatible ([#55](https://github.com/MetaMask/test-bundler/pull/55))
- run tests in the "ci" task ([#52](https://github.com/MetaMask/test-bundler/pull/52))
- [BUG FIX] BundleManager use known signer instead of getSigner() out of provider ([#51](https://github.com/MetaMask/test-bundler/pull/51))
- Move bundler config generation to a seperate file ([#50](https://github.com/MetaMask/test-bundler/pull/50))
- Fix preGasCalculation related defects ([#43](https://github.com/MetaMask/test-bundler/pull/43))
- Check for sigFailed in simulation results ([#39](https://github.com/MetaMask/test-bundler/pull/39))
- Dockerize ([#46](https://github.com/MetaMask/test-bundler/pull/46))
- Returning valid rpc error code ([#48](https://github.com/MetaMask/test-bundler/pull/48))
- Deploying BundlerHelper ([#47](https://github.com/MetaMask/test-bundler/pull/47))
- Fix `entryCount` calculation bug in MempoolManager ([#45](https://github.com/MetaMask/test-bundler/pull/45))
- AA-110-check-codehash ([#42](https://github.com/MetaMask/test-bundler/pull/42))
- Temporary selfdestruct handling ([#41](https://github.com/MetaMask/test-bundler/pull/41))
- Adding a link to bundler-spec-tests repo ([#40](https://github.com/MetaMask/test-bundler/pull/40))
- AA-106 Adding execution error, fixing estimateUserOperationGas ([#38](https://github.com/MetaMask/test-bundler/pull/38))
- userOperationByHash ([#37](https://github.com/MetaMask/test-bundler/pull/37))
- AA-94 bundler keccak rules ([#33](https://github.com/MetaMask/test-bundler/pull/33))
- fix typo ([#35](https://github.com/MetaMask/test-bundler/pull/35))
- Limit mempool instances ([#34](https://github.com/MetaMask/test-bundler/pull/34))
- AA-95 add unsafe flag ([#31](https://github.com/MetaMask/test-bundler/pull/31))
- v0.4.0
- fix logging ([#15](https://github.com/MetaMask/test-bundler/pull/15))
- AA93 rename debug APIs ([#30](https://github.com/MetaMask/test-bundler/pull/30))
- AA-72 bundling module ([#25](https://github.com/MetaMask/test-bundler/pull/25))
- AA-68 bundler rpc calls ([#24](https://github.com/MetaMask/test-bundler/pull/24))
- fix packUserOp (in gas test mode)
- AA-71 use i account ([#23](https://github.com/MetaMask/test-bundler/pull/23))
- Bundler with Geth Tracer ([#22](https://github.com/MetaMask/test-bundler/pull/22))
- Initial support for traceCall for opcode banning. ([#21](https://github.com/MetaMask/test-bundler/pull/21))
- Add sigSize to calcPreVerificationGas ([#20](https://github.com/MetaMask/test-bundler/pull/20))
- fixed README
- API updates ([#12](https://github.com/MetaMask/test-bundler/pull/12))
- v0.2.0 ([#10](https://github.com/MetaMask/test-bundler/pull/10))
- Publish sdk ([#9](https://github.com/MetaMask/test-bundler/pull/9))
- Fix bundler ([#8](https://github.com/MetaMask/test-bundler/pull/8))
- AA-52 rename "@erc4337/client" to "@account-abstraction/sdk"
- fix flow to use mnemonic file.
- cleanup api
- lints
- bundler: fix command-line
- flow test
- package versions, depchecks
- yarn.lock
- lints
- update versions to 0.2.0
- refactor: BaseWalletAPI in a separate file from SimpleWalletApi
- fix provider
- added provider/signer test
- lints
- separate "exec" from "runBundler"
- cleanup packaging.
- owner signer param
- SimpleWalletApi test works
- types work, preprocess
- AA-41: ERC-4337 Provider, Bundler Server and a Docker Image ([#1](https://github.com/MetaMask/test-bundler/pull/1))
- some more logs
- rework in typescript, using BundlerHelper
- Little clean-up
- add code

[Unreleased]: https://github.com/MetaMask/test-bundler/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MetaMask/test-bundler/releases/tag/v1.0.0
