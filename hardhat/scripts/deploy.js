const { ethers } = require("hardhat");

async function main() {
  const Bounty = await ethers.getContractFactory("MergeFund");

  const [deployer, verifier] = await ethers.getSigners();

  console.log(`Deploying contract with deployer: ${deployer.address}`);
  console.log(`Using verifier address: ${verifier.address}`);

  const stakingPrecompileAddress = "0x0000000000000000000000000000000000000800"; // staking precompile
  const collatorPoolAddress = verifier.address; // use verifier for now

  const bountyContract = await Bounty.deploy(stakingPrecompileAddress, collatorPoolAddress);

  console.log("Contract deployment transaction sent. Waiting for confirmation...");

  await bountyContract.waitForDeployment(); // <-- updated for ethers v6

  console.log(`MergeFund deployed to: ${bountyContract.target}`); // <-- updated too!
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
