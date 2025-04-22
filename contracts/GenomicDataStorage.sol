// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract GenomicDataStorage is IERC165 {
    address public immutable admin;
    
    enum Role { NormalUser, Admin }
    
    // struct User {
    //     Role role;
    //     bool exists;
    // }

    struct FileMetaData {
        address owner;
        string fileName;
        string fileType;
        uint256 fileSize;
        string timestamp;
        string ipfsHash;
    }
    
    struct File {
        string ipfsHash;
        string cid;
        uint256 idxOfMetaData;
    }

    
    
    // mapping(address => User) public users;
    mapping(string => File) private files;
    // Separate mapping for access control
    mapping(string => mapping(address => bool)) private fileAccess;
    FileMetaData[] private filesList;
    
    // Events
    event FileUploaded(address indexed user, string ipfsHash);
    event AccessGranted(address indexed owner, address indexed sharedUser, string ipfsHash);
    event AccessRevoked(address indexed owner, address indexed sharedUser, string ipfsHash);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // modifier onlyAdmin() {
    //     require(users[msg.sender].role == Role.Admin, "Only admin can perform this action");
    //     _;
    // }
    
    // modifier onlyUser() {
    //     require(users[msg.sender].exists, "User does not exist");
    //     _;
    // }
    
    // constructor() {
    //     admin = msg.sender;
    //     users[msg.sender] = User(Role.Admin, true);
    // }
    
    // function registerUser(address userAddress) external onlyAdmin {
    //     require(!users[userAddress].exists, "User already registered");
    //     users[userAddress] = User(Role.NormalUser, true);
    // }
    
    function uploadFile(string memory ipfsHash,string memory fileName, string memory cid, string memory fileType, uint256 fileSize, string memory timestamp) external payable {
        // Require a minimum payment (e.g., 0.01 Ether)
        require(msg.value >= 0.01 ether, "Insufficient payment");
        // Ensure the file doesn't already exist
        emit FileUploaded(msg.sender, ipfsHash);
        
        FileMetaData memory metaData = FileMetaData({
            owner: msg.sender,
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            timestamp: timestamp,
            ipfsHash: ipfsHash
        });

        filesList.push(metaData);
        uint256 idx_Of_Meta_Data = filesList.length - 1;

        // Store the file details
        files[ipfsHash] = File({
            ipfsHash: ipfsHash,
            cid: cid,
            idxOfMetaData: idx_Of_Meta_Data
        });
    }
    
    function grantAccess(string memory ipfsHash, address sharedUser) payable external {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        require(filesList[files[ipfsHash].idxOfMetaData].owner == msg.sender, "Only owner can grant access");
        // require(users[sharedUser].exists, "Shared user must be registered");
        
        fileAccess[ipfsHash][sharedUser] = true;
        
        emit AccessGranted(msg.sender, sharedUser, ipfsHash);
    }
    
    function revokeAccess(string memory ipfsHash, address sharedUser) payable external {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        require(filesList[files[ipfsHash].idxOfMetaData].owner == msg.sender, "Only owner can revoke access");
        require(fileAccess[ipfsHash][sharedUser], "User does not have access");
        
        fileAccess[ipfsHash][sharedUser] = false;
        
        emit AccessRevoked(msg.sender, sharedUser, ipfsHash);
    }

    function getFile(string memory ipfsHash) external view returns (string memory) {
        require(filesList[files[ipfsHash].idxOfMetaData].owner == msg.sender || fileAccess[ipfsHash][msg.sender], "Access denied");
        return files[ipfsHash].ipfsHash;
    }

    function getAllFiles() external view returns (FileMetaData[] memory) {
        FileMetaData[] memory allFiles = new FileMetaData[](filesList.length);
        for (uint256 i = 0; i < filesList.length; i++) {
            allFiles[i] = filesList[i];
        }
        return allFiles;
    }
    
    // Complete ERC-20 interface functions
    function name() external pure returns (string memory) {
        return "Genomic Data Storage";
    }
    
    function symbol() external pure returns (string memory) {
        return "GDS";
    }
    
    function decimals() external pure returns (uint8) {
        return 18;
    }
    
    function totalSupply() external pure returns (uint256) {
        return 0;
    }
    
    function balanceOf(address) external pure returns (uint256) {
        return 0;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address, address) external pure returns (uint256) {
        return 0;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Additional ERC-20 functions that might be called
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        emit Approval(msg.sender, spender, addedValue);
        return true;
    }
    
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        emit Approval(msg.sender, spender, 0);
        return true;
    }
    
    // Handle ETH transfers
    receive() external payable {
        // Handle ETH transfers
    }
    
    // Enhanced fallback function with more detailed error messages
    fallback() external payable {
        bytes4 selector = msg.data.length >= 4 ? bytes4(msg.data[0:4]) : bytes4(0);
        
        string memory selectorString;
        if (selector == 0x70a08231) selectorString = "balanceOf(address)";
        else if (selector == 0x313ce567) selectorString = "decimals()";
        else if (selector == 0x95d89b41) selectorString = "symbol()";
        else if (selector == 0x06fdde03) selectorString = "name()";
        else if (selector == 0x18160ddd) selectorString = "totalSupply()";
        else if (selector == 0xa9059cbb) selectorString = "transfer(address,uint256)";
        else if (selector == 0xdd62ed3e) selectorString = "allowance(address,address)";
        else if (selector == 0x095ea7b3) selectorString = "approve(address,uint256)";
        else if (selector == 0x23b872dd) selectorString = "transferFrom(address,address,uint256)";
        else if (selector == 0x39509351) selectorString = "increaseAllowance(address,uint256)";
        else if (selector == 0xa457c2d7) selectorString = "decreaseAllowance(address,uint256)";
        else if (selector == 0x01ffc9a7) selectorString = "supportsInterface(bytes4)";
        else {
            // Print the actual selector for debugging
            bytes memory selectorBytes = new bytes(10);
            for (uint i = 0; i < 4 && i < msg.data.length; i++) {
                selectorBytes[i*2] = bytes1(uint8(uint(uint8(msg.data[i])) / 16) + (uint(uint8(msg.data[i])) / 16 < 10 ? 48 : 87));
                selectorBytes[i*2+1] = bytes1(uint8(uint(uint8(msg.data[i])) % 16) + (uint(uint8(msg.data[i])) % 16 < 10 ? 48 : 87));
            }
            selectorString = string(abi.encodePacked("unknown selector: 0x", selectorBytes));
        }
        
        revert(string(abi.encodePacked("Function not found: ", selectorString)));
    }

    /**
     * @dev Implements the ERC-165 `supportsInterface` function.
     * Returns true if the contract implements the given interface.
     */
    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}
