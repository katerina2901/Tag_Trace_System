// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Manufacturer.sol";

contract Consumer {

    Manufacturer public manufacturer;
    address payable public pillCreator; // Address of the pill creator (manufacturer) that can receive ether

    constructor(address _manufacturerAddress) {
        manufacturer = Manufacturer(_manufacturerAddress);
        pillCreator = payable(manufacturer.contractOwner()); // Set the address of the pill maker, getting it from the manufacturer's contract
    }

    event EatPill(bytes32 indexed secret, uint256 timestamp, address consumer);

    function consumePill(string memory _sku, uint256 _timestamp) public payable {

        // Retrieve tablet information from the manufacturer's repository
        bytes32 _secret = keccak256(abi.encodePacked(_sku, _timestamp));
        // Retrieve tablet information from the manufacturer's repository
        (bytes32 secret, uint8 status, , , ) = manufacturer.viewPillInfo(_secret);
        // Check if the pill exists (secret must not be 0)
        require(secret != 0, "Pill does not exist");
        // Check if the pill has not been consumed
        require(status == 0, "Pill is not consumed");
        
        // Updates the status of the tablet to consumed
        manufacturer.consumePill(_sku, _timestamp, msg.sender);
        // Transfer of funds to the creator of the pill (manufacturer)
        pillCreator.transfer(msg.value);

        // Повторная проверка статуса таблетки
        (, uint8 newStatus, , , ) = manufacturer.viewPillInfo(_secret);
        require(newStatus == 1, "Pill status update failed");
        
        emit EatPill(secret, _timestamp, msg.sender);
    }
    
    // This is temporary view, otherwise once scanned it will be marked as consumed
    function viewData(bytes32 _secret) public view returns (bytes32, uint8, address, uint256, address) {
        return manufacturer.viewPillInfo(_secret);
    }

    // Check keccak256
    function keccakOfNumber(uint _temp) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_temp));
    }
}
