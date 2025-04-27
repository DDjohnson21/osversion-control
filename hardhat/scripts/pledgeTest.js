// pledgeTest.js

const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x82500d676675C13369aed673adaAa2C1886E1E5a";
  const [deployer] = await ethers.getSigners();

  const mergeFund = await ethers.getContractAt("MergeFund", contractAddress);

  const issueId = 1; // or whatever issueId you want to pledge to
  const amount = ethers.parseEther("0.001"); // 0.001 DEV tokens

  const tx = await mergeFund.pledge(issueId, {
    value: amount
  });

  console.log("Transaction hash:", tx.hash);

  await tx.wait();

  console.log("Transaction confirmed!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});