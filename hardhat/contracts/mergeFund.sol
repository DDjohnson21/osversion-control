// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

contract MergeFund {
    address public owner;

    struct Issue {
        uint256 totalPledged;
        bool isOpen;
        address solver_address;
    }

    mapping(uint256 => Issue) public issues; // GitHub Issue ID => Issue info
    mapping(uint256 => mapping(address => uint256)) public pledges; // Issue ID => user => amount

    event IssueOpened(uint256 issueId);
    event Pledged(uint256 issueId, address pledger, uint256 amount);
    event IssueClosed(uint256 issueId, address solver);
    event PayoutFinalized(uint256 issueId, address solver, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // Open a new Issue
    function openIssue(uint256 issueId) external onlyOwner {
        require(!issues[issueId].isOpen, "Issue already open");

        issues[issueId] = Issue({
            totalPledged: 0,
            isOpen: true,
            solver_address: address(0)
        });

        emit IssueOpened(issueId);
    }

    // Allow pledging ETH/DEV tokens toward an open issue
    function pledge(uint256 issueId) external payable {
        require(issues[issueId].isOpen, "Issue closed");
        require(msg.value > 0, "Must pledge > 0");

        issues[issueId].totalPledged += msg.value;
        pledges[issueId][msg.sender] += msg.value;

        emit Pledged(issueId, msg.sender, msg.value);
    }

    // Close an issue and set the solver address
    function closeIssue(uint256 issueId, address solver) external onlyOwner {
        require(issues[issueId].isOpen, "Issue already closed");
        require(solver != address(0), "Solver address cannot be zero");

        issues[issueId].isOpen = false;
        issues[issueId].solver_address = solver;

        emit IssueClosed(issueId, solver);
    }

    // Finalize payout to solver based on the pledged balance
    function finalizePayout(uint256 issueId) external onlyOwner {
        Issue storage issue = issues[issueId];

        require(!issue.isOpen, "Issue still open");
        require(issue.solver_address != address(0), "No solver set");

        uint256 amount = issue.totalPledged;
        require(amount > 0, "No funds to payout");
        require(address(this).balance >= amount, "Contract has insufficient funds");

        // Reset first (protect from reentrancy)
        issue.totalPledged = 0;

        // Actually send the pledged amount
        (bool success, ) = payable(issue.solver_address).call{value: amount}("");
        require(success, "Failed to send Ether");

        emit PayoutFinalized(issueId, issue.solver_address, amount);
    }


    // Helper to get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // NEW: Allow this contract to accept DEV tokens
    receive() external payable {}
}
