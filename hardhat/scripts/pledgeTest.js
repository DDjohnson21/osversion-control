const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xe4705fc67596CF9904B9F6Ea5d8E469a1F9B9aC4"; // replace if different
  const [deployer] = await ethers.getSigners();

  console.log("Deployer address:", deployer.address);

  const mergeFund = await ethers.getContractAt("MergeFund", contractAddress);

  // Read the owner if it's stored
  try {
    const owner = await mergeFund.owner();
    console.log("Contract owner address:", owner);
  } catch (err) {
    console.log("Couldn't fetch contract owner. Maybe no 'owner()' function?");
  }

  const issueId = 10;
  const amount = ethers.parseEther("0.0001");

  console.log("Attempting to pledge for Issue ID:", issueId);
  console.log("Pledge amount (ETH):", ethers.formatEther(amount));

  // Check if issue is open
  try {
    const issue = await mergeFund.issues(issueId);
    console.log(`Issue ${issueId} isOpen:`, issue.isOpen);
    console.log(`Issue ${issueId} totalPledged so far:`, ethers.formatEther(issue.totalPledged));
  } catch (err) {
    console.error("Error fetching issue info:", err);
    return;
  }

  // Now try pledging
  try {
    const tx = await mergeFund.pledge(issueId, {
      value: amount,
      gasLimit: 500000, // manually set a higher gas limit
    });
    console.log("Transaction sent. Hash:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed!");
  } catch (error) {
    console.error("Transaction failed with error:");
    console.error(error);
    if (error.error && error.error.message) {
      console.error("Revert reason:", error.error.message);
    }
  }
}

main().catch((error) => {
  console.error("Fatal script error:", error);
  process.exit(1);
});
