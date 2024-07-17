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

    event EatPill(uint indexed _productionSequence, string _sku, uint256 _timestamp, address consumer);

    function consumePill(uint _productionSequence, string memory _sku, uint256 _timestamp) public payable {

        // Retrieve tablet information from the manufacturer's repository
        (uint prod_num, uint8 status, , , ) = manufacturer.viewPillInfo(_productionSequence, _sku, _timestamp);
        // Check if the pill exists (prod_num must not be 0)
        require(prod_num != 0, "Pill does not exist");
        // Check if the pill has not been consumed
        require(status == 0, "Pill alis not consumed");
        
        // Updates the status of the tablet to consumed
        manufacturer.consumePill(_productionSequence, _sku, _timestamp, msg.sender);
        // Transfer of funds to the creator of the pill (manufacturer)
        pillCreator.transfer(msg.value);

        emit EatPill(_productionSequence, _sku, _timestamp, msg.sender);
    }
    
        
    // This is temporary view, otherwise once scanned it will be marked as consumed
    function viewData(uint _productionSequence, string memory _sku, uint256 _timestamp) public view returns (uint, uint8, address, string memory, uint256) {
        return manufacturer.viewPillInfo(_productionSequence, _sku, _timestamp);
    }

    // Check keccak256
    function keccakOfNumber(uint _temp) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_temp));
    }
}
