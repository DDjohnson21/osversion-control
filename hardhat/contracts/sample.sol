// contracts/MockParachainStaking.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockParachainStaking {
    function delegate(address, uint256, uint256, uint256) external pure returns (bool) {
        return true;
    }

    function schedule_revoke_delegation(address) external pure returns (bool) {
        return true;
    }

    function execute_delegation_request(address, address) external pure returns (bool) {
        return true;
    }
}
