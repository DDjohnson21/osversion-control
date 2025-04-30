const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MergeFund", function () {
  let bountyContract;
  let owner, pledger1, pledger2, solver, verifier;

  beforeEach(async function () {
    [owner, pledger1, pledger2, solver, verifier] = await ethers.getSigners();

    const Bounty = await ethers.getContractFactory("MergeFund");
    bountyContract = await Bounty.deploy(); // <-- fix: no arguments passed
    await bountyContract.waitForDeployment(); // <-- important with ethers v6
  });

  it("should open an issue", async function () {
    const issueId = 1;
    await bountyContract.openIssue(issueId);
    const issue = await bountyContract.issues(issueId);
    expect(issue.isOpen).to.equal(true);
  });

  it("should allow pledging to an open issue", async function () {
    const issueId = 2;
    const pledgeAmount = ethers.parseEther("1.0");

    await bountyContract.openIssue(issueId);

    await bountyContract.connect(pledger1).pledge(issueId, { value: pledgeAmount });

    const issue = await bountyContract.issues(issueId);
    expect(issue.totalPledged).to.equal(pledgeAmount);

    const pledgedAmount = await bountyContract.pledges(issueId, pledger1.address);
    expect(pledgedAmount).to.equal(pledgeAmount);
  });

  it("should allow solver to claim reward after issue is closed", async function () {
    const issueId = 3;
    const pledgeAmount = ethers.parseEther("1.5");

    await bountyContract.openIssue(issueId);
    await bountyContract.connect(pledger2).pledge(issueId, { value: pledgeAmount });

    await bountyContract.closeIssue(issueId, solver.address);

    const issue = await bountyContract.issues(issueId);
    expect(issue.isOpen).to.equal(false);
    expect(issue.solver_address).to.equal(solver.address);
  });

  it("should finalize payout correctly", async function () {
    const issueId = 4;
    const pledgeAmount = ethers.parseEther("2.0");

    await bountyContract.openIssue(issueId);
    await bountyContract.connect(pledger1).pledge(issueId, { value: pledgeAmount });

    await bountyContract.closeIssue(issueId, solver.address);

    const initialBalance = await ethers.provider.getBalance(solver.address);

    const finalizeTx = await bountyContract.finalizePayout(issueId);
    await finalizeTx.wait();

    const finalBalance = await ethers.provider.getBalance(solver.address);

    expect(finalBalance).to.be.gt(initialBalance);
  });

});
