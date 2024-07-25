// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Manufacturer {
    // Address of the contract owner - manufacturer
    address payable public owner; // address -> 20 bytes
    string public company; // manufacturing company name

    event PillCreated(string message, string SKU, bytes32 secret); 
    
    struct Pill {
        bytes32 secret; // This will be equal to the production number, we will have it in the form of QR simple sequence number. i.e. unique id, Also we assume that it is a _secret
        uint8 status; // 0 - not consumed, 1 - consumed, 2 - in transit
        address consumedBy; // The address of the consumer who used the pill.
        //string SKU; // SKU number from Excel
        uint256 productionDate; // Timestamp of pell creation // added 
        address manufacturer;
    }

    // Pillbook
    mapping(bytes32 => Pill) public Pillbook; // A repository for all tablets identified by their hash value

    
    constructor(string memory _company) {
        owner = payable(msg.sender);
        company = _company; 
    }

     modifier onlyManufacturer {
        require(owner == msg.sender, 'Only Manufacturer can access!!!');
        _;
    } 

    // Creating Pills
    function createPills(string memory _sku, uint256 _timestamp) public onlyManufacturer {
        // Create a secret key based on the current production number
        bytes32 _secret = keccak256(abi.encodePacked(_sku, _timestamp)); 
        
        // Save the new pill to the repository
        Pillbook[_secret] = Pill({
            secret: _secret,
            status: 0,
            consumedBy: address(0),
            productionDate: _timestamp,
            manufacturer: msg.sender
        });

        emit PillCreated("Pill created:",_sku, _secret);
    }

    // Consuming the Pill
    function consumePill(string memory _sku, uint256 _timestamp, address _consumer) external {
        // Create a secret key based on the pill ID
        bytes32 _secret = keccak256(abi.encodePacked(_sku, _timestamp));
        // Checking that pill is not consumed already
        require(Pillbook[_secret].status == 0, "Pill is consumed!");
        // Update the tablet status to consumed and save the consumer's address
        Pillbook[_secret].status = 1;
        Pillbook[_secret].consumedBy = _consumer;
    }

    // Setting the pill to in transit state
    function setPillInTransit(string memory _sku, uint256 _timestamp) external onlyManufacturer {
        // Create a secret key based on the pill ID
        bytes32 _secret = keccak256(abi.encodePacked(_sku, _timestamp));
        // Update the tablet status to in transit
        Pillbook[_secret].status = 2;
    }

    // Viewing data
    // This is temporary view, otherwise once scanned it will be marked as consumed
    function viewPillInfo(bytes32 _secret) public view returns (bytes32, uint8, address, uint256, address) {
    // Create a secret key based on the pill ID
    // bytes32 _secret = keccak256(abi.encodePacked(_sku, _timestamp));
    // Get the information about the tablet from the repository
        Pill memory pill = Pillbook[_secret];
        require(pill.secret != bytes32(0), "Pill does not exist");
        // Return the production cycle number, consumption status and address of the tablet consumer
        return (pill.secret, pill.status, pill.consumedBy, pill.productionDate, pill.manufacturer);
    }

    // Function to get the address of the contract owner
    function contractOwner() public view returns (address) {
        return owner;
    }

    // Function to get the secret for a given production sequence
    function getSecret(string memory _sku, uint256 _timestamp) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_sku, _timestamp));
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
