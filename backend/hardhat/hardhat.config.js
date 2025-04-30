require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

require('hardhat-resolc');
require('hardhat-revive-node');

module.exports = {
  solidity: "0.8.20",
  resolc: {
    version: '1.5.2',
    compilerSource: 'remix',
    settings: {
      optimizer: {
        enabled: false,
        runs: 600,
      },
      evmVersion: 'istanbul',
    },
  },
  networks: {
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      chainId: 1287,
      accounts: [
        "0xa517a9b9565d7e3b89aacbfdd25eb9ee5682b75a1aeac3c00d80484def8439b5",
        "0c6a4536f658b39e61fbd221e57c4fc9c8d0df47f9bb963c0b19819479f3f23e" 
      ]
    }
  }
};
