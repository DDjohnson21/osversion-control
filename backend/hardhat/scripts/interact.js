const { ethers } = require("hardhat");

async function main() {
  // Get the contract address from your deployment
  const contractAddress = "0xe4705fc67596CF9904B9F6Ea5d8E469a1F9B9aC4"; // Replace with your deployed contract address
  const [deployer, pledger, solver] = await ethers.getSigners();

  console.log("Deployer address:", deployer.address);
  console.log("Pledger address:", pledger.address);
  console.log("Solver address:", solver.address);

  const mergeFund = await ethers.getContractAt("MergeFund", contractAddress);

  // Example Issue ID
  const issueId = 123;
  const pledgeAmount = ethers.parseEther("0.1"); // 0.1 ETH

  try {
    // 1. Open an issue (only owner can do this)
    console.log("\n1. Opening issue...");
    const openTx = await mergeFund.openIssue(issueId);
    await openTx.wait();
    console.log("Issue opened successfully!");

    // 2. Pledge funds (anyone can do this)
    console.log("\n2. Making a pledge...");
    const pledgeTx = await mergeFund.connect(pledger).pledge(issueId, {
      value: pledgeAmount,
    });
    await pledgeTx.wait();
    console.log("Pledge successful!");

    // 3. Check issue status
    console.log("\n3. Checking issue status...");
    const issue = await mergeFund.issues(issueId);
    console.log("Issue is open:", issue.isOpen);
    console.log("Total pledged:", ethers.formatEther(issue.totalPledged), "ETH");

    // 4. Close issue and set solver (only owner can do this)
    console.log("\n4. Closing issue and setting solver...");
    const closeTx = await mergeFund.closeIssue(issueId, solver.address);
    await closeTx.wait();
    console.log("Issue closed and solver set!");

    // 5. Finalize payout (only owner can do this)
    console.log("\n5. Finalizing payout...");
    const payoutTx = await mergeFund.finalizePayout(issueId);
    await payoutTx.wait();
    console.log("Payout finalized!");

    // 6. Check final balances
    console.log("\n6. Checking final balances...");
    const contractBalance = await mergeFund.getContractBalance();
    console.log("Contract balance:", ethers.formatEther(contractBalance), "ETH");

  } catch (error) {
    console.error("Error occurred:", error.message);
    if (error.error && error.error.message) {
      console.error("Revert reason:", error.error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 