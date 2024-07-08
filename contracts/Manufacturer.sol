// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Manufacturer {
    // Address of the contract owner - manufacturer
    address payable public owner; // address -> 20 bytes
    string public company; // manufacturing company name
    uint public productionSequence; // Start from 1; because default if 0, and we take a flagthat is such exists it is a fake one.

    event PillCreated(string message, uint indexed prod_num, string SKU, bytes32 secret); 
    
    struct Pill {
        uint prod_num; // This will be equal to the production number, we will have it in the form of QR simple sequence number. i.e. unique id, Also we assume that it is a _secret
        uint8 status; // 0 - not consumed, 1 - consumed, 2 - in transit
        address consumedBy; // The address of the consumer who used the pill.
        string SKU; // SKU number from Excel
        uint256 timestamp; // Timestamp of pell creation // added 
    }

    // Pillbook
    mapping(bytes32 => Pill) public Pillbook; // A repository for all tablets identified by their hash value

    
    constructor(string memory _company) {
        owner = payable(msg.sender);
        company = _company; 
        productionSequence = 1;  // Start from 1; because default if 0, and we take a flag/marked that is such exists it is a fake one.
    }

     modifier onlyManufacturer {
        require(owner == msg.sender, 'Only Manufacturer can access!!!');
        _;
    } 

    // Creating Pills
    function createPills(string memory _sku, uint256 currentTimestamp) public onlyManufacturer {
        // Create a secret key based on the current production number
        bytes32 _secret = keccak256(abi.encodePacked(productionSequence, _sku, currentTimestamp)); 
        uint prod_num = productionSequence; // Unique production cycle number
        uint8 status = 0; // The pill is not initially consumed
        address consumedBy = address(0); // Initially the pill is not consumed, so the address is empty 
        
        // Save the new pill to the repository
        Pillbook[_secret] = Pill(prod_num, status, consumedBy, _sku, currentTimestamp);
        // Increasing the production cycle number
        productionSequence++;
        emit PillCreated("Pill created, number:", prod_num, _sku, _secret);
    }

    // Consuming the Pill
    function consumePill(uint _productionSequence, string memory _sku, uint256 _timestamp, address _consumer) external {
        // Create a secret key based on the pill ID
        bytes32 _secret = keccak256(abi.encodePacked(_productionSequence, _sku, _timestamp));
        // Checking that pill is not consumed already
        require(Pillbook[_secret].status == 0, "Pill is not consumed!");
        // Update the tablet status to consumed and save the consumer's address
        Pillbook[_secret].status = 1;
        Pillbook[_secret].consumedBy = _consumer;
    }

    // Setting the pill to in transit state
    function setPillInTransit(uint _productionSequence, string memory _sku, uint256 _timestamp) external onlyManufacturer {
        // Create a secret key based on the pill ID
        bytes32 _secret = keccak256(abi.encodePacked(_productionSequence, _sku, _timestamp));
        // Update the tablet status to in transit
        Pillbook[_secret].status = 2;
    }

    // Viewing data
    // This is temporary view, otherwise once scanned it will be marked as consumed
    function viewPillInfo(uint _productionSequence, string memory _sku, uint256 _timestamp) public view returns (uint, uint8, address, string memory, uint256) {
    // Create a secret key based on the pill ID
    bytes32 _secret = keccak256(abi.encodePacked(_productionSequence, _sku, _timestamp));
    // Get the information about the tablet from the repository
    Pill memory pill = Pillbook[_secret];
    // Return the production cycle number, consumption status and address of the tablet consumer
    return (pill.prod_num, pill.status, pill.consumedBy, pill.SKU, pill.timestamp);
    }

    // Function to get the address of the contract owner
    function contractOwner() public view returns (address) {
        return owner;
    }

    // Function to get the secret for a given production sequence
    function getSecret(uint _productionSequence, string memory _sku, uint256 _timestamp) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_productionSequence, _sku, _timestamp));
    }

    // Function to generate error message based on pill state
    function getErrorMessage(uint8 status) internal pure returns (string memory) {
        if (status == 1) {
            return "Pill already consumed!!";
        } else if (status == 2) {
            return "Pill is in transit!!";
        } else {
            return "Invalid status!!";
        }
    }

}
