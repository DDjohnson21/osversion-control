const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MergeFund = await hre.ethers.getContractFactory("MergeFund");

  const mergeFund = await MergeFund.deploy();
  await mergeFund.waitForDeployment();

  console.log(`MergeFund deployed to: ${mergeFund.target || mergeFund.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
