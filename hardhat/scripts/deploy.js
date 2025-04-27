const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MergeFund = await hre.ethers.getContractFactory("MergeFund");

  const stakingPrecompileAddress = "0x0000000000000000000000000000000000000000"; // dummy
  const collatorPoolAddress = "0x0000000000000000000000000000000000000000";  // dummy

  const mergeFund = await MergeFund.deploy(stakingPrecompileAddress, collatorPoolAddress);
  await mergeFund.waitForDeployment();

  console.log(`MergeFund deployed to: ${mergeFund.target || mergeFund.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
