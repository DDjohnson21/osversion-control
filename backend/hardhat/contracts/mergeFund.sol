// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

contract MergeFund {
    address public owner;
    address public constant DEAD_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    struct Issue {
        uint256 totalPledged;
        bool isOpen;
        address solver_address;
        address[] pledgers;
        bool isPaidOut;
    }

    mapping(uint256 => Issue) public issues; // GitHub Issue ID => Issue info
    mapping(uint256 => mapping(address => uint256)) public pledges; // Issue ID => user => amount

    event IssueOpened(uint256 issueId);
    event Pledged(uint256 issueId, address pledger, uint256 amount);
    event IssueClosed(uint256 issueId, address solver);
    event PayoutFinalized(uint256 issueId, address solver, uint256 amount);
    event PledgeRefunded(uint256 issueId, address pledger, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier issueExists(uint256 issueId) {
        require(
            issues[issueId].isOpen ||
                issues[issueId].solver_address != address(0),
            "Issue does not exist"
        );
        _;
    }

    // Open a new Issue
    function openIssue(uint256 issueId) external onlyOwner {
        require(!issues[issueId].isOpen, "Issue already open");
        require(
            issues[issueId].solver_address == address(0),
            "Issue already exists"
        );

        issues[issueId] = Issue({
            totalPledged: 0,
            isOpen: true,
            solver_address: address(0),
            pledgers: new address[](0),
            isPaidOut: false
        });

        emit IssueOpened(issueId);
    }

    // Allow pledging ETH/DEV tokens toward an open issue
    function pledge(uint256 issueId) external payable issueExists(issueId) {
        require(issues[issueId].isOpen, "Issue is closed");
        require(msg.value > 0, "Must pledge > 0");
        require(msg.sender != DEAD_ADDRESS, "Invalid pledger address");
        require(!issues[issueId].isPaidOut, "Issue already paid out");

        Issue storage issue = issues[issueId];

        // If this is the first pledge from this address, add them to pledgers array
        if (pledges[issueId][msg.sender] == 0) {
            issue.pledgers.push(msg.sender);
        }

        issue.totalPledged += msg.value;
        pledges[issueId][msg.sender] += msg.value;

        emit Pledged(issueId, msg.sender, msg.value);
    }

    // Close an issue and set the solver address
    function closeIssue(
        uint256 issueId,
        address solver
    ) external onlyOwner issueExists(issueId) {
        require(issues[issueId].isOpen, "Issue already closed");
        require(
            solver != address(0) && solver != DEAD_ADDRESS,
            "Invalid solver address"
        );
        require(solver != owner, "Owner cannot be solver");

        issues[issueId].isOpen = false;
        issues[issueId].solver_address = solver;

        emit IssueClosed(issueId, solver);
    }

    // Finalize payout to solver based on the pledged balance
    function finalizePayout(
        uint256 issueId
    ) external onlyOwner issueExists(issueId) {
        Issue storage issue = issues[issueId];

        require(!issue.isOpen, "Issue still open");
        require(issue.solver_address != address(0), "No solver set");
        require(!issue.isPaidOut, "Already paid out");
        require(issue.totalPledged > 0, "No funds to payout");
        require(
            address(this).balance >= issue.totalPledged,
            "Contract has insufficient funds"
        );

        uint256 amount = issue.totalPledged;

        // Mark as paid before transfer to prevent reentrancy
        issue.isPaidOut = true;
        issue.totalPledged = 0;

        // Send the pledged amount to solver
        (bool success, ) = payable(issue.solver_address).call{value: amount}(
            ""
        );
        require(success, "Failed to send Ether");

        emit PayoutFinalized(issueId, issue.solver_address, amount);
    }

    // Allow pledgers to withdraw their funds if issue is still open
    function withdrawPledge(uint256 issueId) external issueExists(issueId) {
        require(issues[issueId].isOpen, "Issue is closed");
        require(pledges[issueId][msg.sender] > 0, "No pledge to withdraw");

        uint256 amount = pledges[issueId][msg.sender];

        // Update state before transfer
        pledges[issueId][msg.sender] = 0;
        issues[issueId].totalPledged -= amount;

        // Send the pledged amount back to pledger
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Failed to send Ether");

        emit PledgeRefunded(issueId, msg.sender, amount);
    }

    // Helper to get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Helper to get all pledgers for an issue
    function getPledgers(
        uint256 issueId
    ) external view returns (address[] memory) {
        return issues[issueId].pledgers;
    }

    receive() external payable {}
}
