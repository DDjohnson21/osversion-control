const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GitHubIssueBounty", function () {
  let bountyContract;
  let owner, pledger1, pledger2, solver, verifier;

  beforeEach(async function () {
    [owner, pledger1, pledger2, solver, verifier] = await ethers.getSigners();

    const Bounty = await ethers.getContractFactory("GitHubIssueBounty");
    bountyContract = await Bounty.deploy(verifier.address);
    await bountyContract.deployed();
  });

  it("should open an issue", async function () {
    await expect(bountyContract.openIssue(1))
      .to.emit(bountyContract, "IssueOpened")
      .withArgs(1);
  });

  it("should allow pledging to an open issue", async function () {
    await bountyContract.openIssue(1);

    await expect(
      bountyContract.connect(pledger1).pledge(1, { value: ethers.utils.parseEther("1") })
    ).to.emit(bountyContract, "Pledged");

    const pledgeAmount = await bountyContract.pledges(1, pledger1.address);
    expect(pledgeAmount).to.equal(ethers.utils.parseEther("1"));
  });

  it("should allow solver to claim reward after verifier signature", async function () {
    await bountyContract.openIssue(1);
    await bountyContract.connect(pledger1).pledge(1, { value: ethers.utils.parseEther("1") });

    const issueId = 1;
    const commitSha = ethers.utils.formatBytes32String("commit123");

    const messageHash = ethers.utils.solidityKeccak256(
      ["uint256", "bytes32", "address"],
      [issueId, commitSha, solver.address]
    );
    const signature = await verifier.signMessage(ethers.utils.arrayify(messageHash));

    await expect(
      bountyContract.connect(solver).claimReward(issueId, commitSha, solver.address, signature)
    ).to.emit(bountyContract, "IssueSolved");

    const issue = await bountyContract.issues(1);
    expect(issue.isOpen).to.be.false;
    expect(issue.solver).to.equal(solver.address);
  });

  it("should allow refund after cancellation", async function () {
    await bountyContract.openIssue(1);
    await bountyContract.connect(pledger1).pledge(1, { value: ethers.utils.parseEther("1") });

    await bountyContract.cancelIssue(1);

    await expect(
      bountyContract.connect(pledger1).refund(1)
    ).to.emit(bountyContract, "Refunded");

    const refundBalance = await bountyContract.pledges(1, pledger1.address);
    expect(refundBalance).to.equal(0);
  });
});
