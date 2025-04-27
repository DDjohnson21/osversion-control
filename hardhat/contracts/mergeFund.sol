// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "./StakingInterface.sol";

contract MergeFund {
    ParachainStaking public staking;
    address public collatorPoolAddress;
    address public owner; 

    struct Issue {
        uint256 totalPledged;
        bool isOpen;
        address solver_address;
    }

    mapping(uint256 => Issue) public issues; // GitHub Issue ID => Issue info
    mapping(uint256 => mapping(address => uint256)) public pledges; // Issue ID => user => amount

    //  New: Declare events
    event IssueOpened(uint256 issueId);
    event Pledged(uint256 issueId, address pledger, uint256 amount);
    event IssueSolved(uint256 issueId, address solver);
    event Refunded(uint256 issueId, address pledger, uint256 amount);

    constructor(address stakingPrecompileAddress, address _collatorPoolAddress) {
        staking = ParachainStaking(stakingPrecompileAddress);
        collatorPoolAddress = _collatorPoolAddress;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function pledge(uint256 issueId) external payable {
        require(issues[issueId].isOpen, "Issue closed");
        require(msg.value > 0, "Must pledge > 0");

        // Stake the pledged amount
        staking.delegate(collatorPoolAddress, msg.value, 0, 0);

        // Record the pledge
        pledges[issueId][msg.sender] += msg.value;
        issues[issueId].totalPledged += msg.value;

        //  Emit Pledged event
        emit Pledged(issueId, msg.sender, msg.value);
    }

    function openIssue(uint256 issueId) external onlyOwner {
        require(!issues[issueId].isOpen, "Issue already open");
        issues[issueId].isOpen = true;

        //  Emit IssueOpened event
        emit IssueOpened(issueId);
    }

    function closeIssue(uint256 issueId, address solver_address) external onlyOwner {
        if (!issues[issueId].isOpen) {
            // Already closed, don't revert, just exit
            return;
        }

        issues[issueId].isOpen = false;
        issues[issueId].solver_address = solver_address;

        // Request unstaking
        staking.schedule_revoke_delegation(collatorPoolAddress);

        emit IssueSolved(issueId, solver_address);
    }

    function finalizePayout(uint256 issueId) external onlyOwner {
        Issue storage issue = issues[issueId];
        require(!issue.isOpen, "Issue still open");
        require(issue.solver_address != address(0), "No solver_address assigned");

        // Execute the delegation revoke to get tokens back
        staking.execute_delegation_request(address(this), collatorPoolAddress);

        // Pay the solver_address (for simplicity assuming balance already unlocked)
        payable(issue.solver_address).transfer(issue.totalPledged);

        // Clean up
        issue.totalPledged = 0;
    }

    //  New: Refund function
    function refund(uint256 issueId) external {
        require(!issues[issueId].isOpen, "Issue still open");

        uint256 refundAmount = pledges[issueId][msg.sender];
        require(refundAmount > 0, "No pledge to refund");

        // Clear the pledge first (checks-effects-interactions pattern)
        pledges[issueId][msg.sender] = 0;

        // Refund ETH
        payable(msg.sender).transfer(refundAmount);

        //  Emit Refunded event
        emit Refunded(issueId, msg.sender, refundAmount);
    }
}
