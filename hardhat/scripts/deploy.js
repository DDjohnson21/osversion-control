const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const Bounty = await ethers.getContractFactory("GitHubIssueBounty");

  // Get deployer address (default signer)
  const [deployer, verifier] = await ethers.getSigners();

  console.log(`Deploying contract with deployer: ${deployer.address}`);
  console.log(`Using verifier address: ${verifier.address}`);

  // Deploy the contract, passing the verifier address
  const bountyContract = await Bounty.deploy(verifier.address);

  // Wait for deployment to be confirmed
  await bountyContract.deployed();

  console.log(`GitHubIssueBounty deployed to: ${bountyContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
