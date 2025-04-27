require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
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
