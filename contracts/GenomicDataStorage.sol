// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract GenomicDataStorage is IERC165 {
    address public immutable admin;
    
    enum Role { NormalUser, Admin }
    
    struct User {
        Role role;
        bool exists;
    }
    
    // Struct to store detailed file information on the blockchain
    struct File {
        string ipfsHash;
        address owner;
        mapping(address => bool) sharedWith; // Tracks which users a file is shared with
        string name;
        string fileType;
        uint256 fileSize;
        uint256 uploadTime; // Unix timestamp
    }

    // Struct used specifically for returning file information in the getAllFiles function
    struct FileInfo {
        string ipfsHash; // Include IPFS hash in FileInfo for download link in frontend
        string name;
        address owner;
        string fileType;
        uint256 fileSize;
        uint256 uploadTime;
    }

    mapping(address => User) public users; // Maps user addresses to their User struct
    mapping(string => File) private files; // Maps IPFS hashes to File structs
    string[] public allFiles; // Array of all IPFS hashes, maintains order

    // Events to log important actions, useful for frontend listening
    event FileUploaded(address indexed owner, string ipfsHash, string name, string fileType, uint256 fileSize, uint256 uploadTime);
    event AccessGranted(address indexed owner, address indexed sharedUser, string ipfsHash);
    event AccessRevoked(address indexed owner, address indexed sharedUser, string ipfsHash);
    event UserRegistered(address indexed user);

    // Custom Errors
    error OnlyAdmin();
    error UserDoesNotExist();
    error FileDoesNotExist();
    error FileAlreadyExists();
    error Unauthorized();
    error AlreadyHasAccess();

    // Modifiers for access control
    modifier onlyAdmin() {
        if (users[msg.sender].role != Role.Admin) revert OnlyAdmin();
        _;
    }

    modifier onlyUser() {
        if (!users[msg.sender].exists) revert UserDoesNotExist();
        _;
    }

    modifier fileExists(string memory ipfsHash) {
        if (bytes(files[ipfsHash].ipfsHash).length == 0) revert FileDoesNotExist();
        _;
    }

    // Constructor: Sets the deployer as the admin and registers them
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User(Role.Admin, true);
    }

    // Automatic user registration: Allows any address to register themselves as a NormalUser
    function registerUser() external {
        if (!users[msg.sender].exists) {
            users[msg.sender] = User(Role.NormalUser, true);
            emit UserRegistered(msg.sender);
        }
    }

    // Uploads file metadata to the blockchain
    function uploadFile(string memory ipfsHash, string memory name, string memory fileType, uint256 fileSize) external onlyUser {
        if (bytes(files[ipfsHash].ipfsHash).length != 0) revert FileAlreadyExists(); // Prevent duplicate uploads of the same hash

        files[ipfsHash].ipfsHash = ipfsHash;
        files[ipfsHash].owner = msg.sender;
        files[ipfsHash].name = name;
        files[ipfsHash].fileType = fileType;
        files[ipfsHash].fileSize = fileSize;
        files[ipfsHash].uploadTime = block.timestamp;

        allFiles.push(ipfsHash); // Add the hash to the ordered list of all files

        // Emit event with all file metadata
        emit FileUploaded(msg.sender, ipfsHash, name, fileType, fileSize, block.timestamp);
    }

    // Grants another registered user access to a file
    function grantAccess(string memory ipfsHash, address sharedUser) external onlyUser fileExists(ipfsHash) {
        if (files[ipfsHash].owner != msg.sender) revert Unauthorized(); // Only the owner can grant access
        if (!users[sharedUser].exists) revert UserDoesNotExist(); // Ensure the user to share with exists
        if (files[ipfsHash].sharedWith[sharedUser]) revert AlreadyHasAccess(); // Prevent granting access twice

        files[ipfsHash].sharedWith[sharedUser] = true;

        emit AccessGranted(msg.sender, sharedUser, ipfsHash);
    }

    // Revokes access for a shared user to a file
    function revokeAccess(string memory ipfsHash, address sharedUser) external onlyUser fileExists(ipfsHash) {
        if (files[ipfsHash].owner != msg.sender) revert Unauthorized(); // Only the owner can revoke access
        if (!files[ipfsHash].sharedWith[sharedUser]) revert Unauthorized(); // Ensure the user currently has access

        files[ipfsHash].sharedWith[sharedUser] = false;

        emit AccessRevoked(msg.sender, sharedUser, ipfsHash);
    }

    // Gets full details for a single file with access control
    function getFileDetails(string memory ipfsHash) external view onlyUser fileExists(ipfsHash) returns (string memory, address, string memory, string memory, uint256, uint256) {
        // Require that the caller is either the owner or has been shared access
        if (files[ipfsHash].owner != msg.sender && !files[ipfsHash].sharedWith[msg.sender]) revert Unauthorized();
        File storage file = files[ipfsHash];
        return (file.ipfsHash, file.owner, file.name, file.fileType, file.fileSize, file.uploadTime);
    }

    // Gets the owner of a file (useful for displaying owner without full details check)
    function getFileOwner(string memory ipfsHash) external view fileExists(ipfsHash) returns (address) {
        return files[ipfsHash].owner;
    }

    // Gets information (hash, name, owner, metadata) for all files
    // This function generates the list on demand, balancing read/write costs
    function getAllFiles() external view returns (FileInfo[] memory) {
        FileInfo[] memory fileInfos = new FileInfo[](allFiles.length);
        for (uint i = 0; i < allFiles.length; i++) {
            string memory ipfsHash = allFiles[i];
            File storage file = files[ipfsHash]; // Use storage reference for efficiency
            fileInfos[i] = FileInfo({
                ipfsHash: file.ipfsHash, // Include ipfsHash
                name: file.name,
                owner: file.owner,
                fileType: file.fileType,
                fileSize: file.fileSize,
                uploadTime: file.uploadTime
            });
        }
        return fileInfos;
    }

    // Checks if a user has access (owner or sharedWith) to a file
    function hasAccess(string memory ipfsHash, address user) public view fileExists(ipfsHash) returns (bool) {
         // Changed to public to be callable from other contracts or directly if needed,
         // but the check is based on the 'user' parameter, not msg.sender directly.
         // Frontend will call this with current user's address.
        return files[ipfsHash].owner == user || files[ipfsHash].sharedWith[user];
    }

     // Optional: Get File by IPFS hash without user-level access control (only file existence)
     // Use with caution, as this exposes metadata for any existing file
     function getFilePublicDetails(string memory ipfsHash) external view fileExists(ipfsHash) returns (string memory, address, string memory, string memory, uint256, uint256) {
         File storage file = files[ipfsHash];
         return (file.ipfsHash, file.owner, file.name, file.fileType, file.fileSize, file.uploadTime);
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
