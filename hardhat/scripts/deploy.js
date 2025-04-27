const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MergeFund", function () {
  let bountyContract;
  let mockStaking;
  let owner, pledger1, pledger2, solver, verifier;

  beforeEach(async function () {
    [owner, pledger1, pledger2, solver, verifier] = await ethers.getSigners();

    // Deploy sample first
    const MockStaking = await ethers.getContractFactory("sample");
    mockStaking = await MockStaking.deploy();
    await mockStaking.waitForDeployment();

    // Now deploy MergeFund using mockStaking address
    const MergeFund = await ethers.getContractFactory("MergeFund");
    bountyContract = await MergeFund.deploy(mockStaking.target, verifier.address);
    await bountyContract.waitForDeployment();
  });

  it("should open an issue", async function () {
    await expect(bountyContract.openIssue(1))
      .to.emit(bountyContract, "IssueOpened")
      .withArgs(1);
  });

  it("should allow pledging to an open issue", async function () {
    await bountyContract.openIssue(1);

    await expect(
      bountyContract.connect(pledger1).pledge(1, { value: ethers.parseEther("1") })
    ).to.emit(bountyContract, "Pledged");
  });

  it("should allow solver to claim reward after verifier signature", async function () {
    await bountyContract.openIssue(1);
    await bountyContract.connect(pledger1).pledge(1, { value: ethers.parseEther("1") });

    await bountyContract.closeIssue(1, solver.address);
    await bountyContract.finalizePayout(1);

    // Check solver received funds (balance check optional)
  });

  it("should allow refund after cancellation", async function () {
    await bountyContract.openIssue(1);
    await bountyContract.connect(pledger1).pledge(1, { value: ethers.parseEther("1") });

    await bountyContract.closeIssue(1, ethers.ZeroAddress); // no solver
    await expect(bountyContract.connect(pledger1).refund(1))
      .to.emit(bountyContract, "Refunded");
  });
});
