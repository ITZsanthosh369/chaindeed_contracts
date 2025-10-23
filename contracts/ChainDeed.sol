// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainDeed is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 private _requestIdCounter;

    struct MintRequest {
        uint256 requestId;
        address requester;
        string tokenURI;
        string description;
        uint256 timestamp;
        RequestStatus status;
    }

    enum RequestStatus {
        Pending,
        Approved,
        Rejected
    }

    mapping(uint256 => MintRequest) public mintRequests;
    mapping(address => uint256[]) public userRequests;
    uint256[] public allRequestIds;

    event ChainDeedMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintRequestSubmitted(uint256 indexed requestId, address indexed requester, string tokenURI, string description);
    event MintRequestApproved(uint256 indexed requestId, uint256 indexed tokenId);
    event MintRequestRejected(uint256 indexed requestId, string reason);

    constructor() ERC721("ChainDeed Certificate", "DEED") Ownable(msg.sender) {
        _tokenIdCounter = 0;
        _requestIdCounter = 0;
    }

    // User submits a minting request
    function requestMint(string memory tokenURI, string memory description) public returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        _requestIdCounter++;
        uint256 newRequestId = _requestIdCounter;

        mintRequests[newRequestId] = MintRequest({
            requestId: newRequestId,
            requester: msg.sender,
            tokenURI: tokenURI,
            description: description,
            timestamp: block.timestamp,
            status: RequestStatus.Pending
        });

        userRequests[msg.sender].push(newRequestId);
        allRequestIds.push(newRequestId);

        emit MintRequestSubmitted(newRequestId, msg.sender, tokenURI, description);

        return newRequestId;
    }

    // Owner approves a request and mints the NFT
    function approveMintRequest(uint256 requestId) public onlyOwner returns (uint256) {
        MintRequest storage request = mintRequests[requestId];
        require(request.requestId != 0, "Request does not exist");
        require(request.status == RequestStatus.Pending, "Request already processed");

        request.status = RequestStatus.Approved;

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(request.requester, newTokenId);
        _setTokenURI(newTokenId, request.tokenURI);

        emit MintRequestApproved(requestId, newTokenId);
        emit ChainDeedMinted(request.requester, newTokenId, request.tokenURI);

        return newTokenId;
    }

    // Owner rejects a request
    function rejectMintRequest(uint256 requestId, string memory reason) public onlyOwner {
        MintRequest storage request = mintRequests[requestId];
        require(request.requestId != 0, "Request does not exist");
        require(request.status == RequestStatus.Pending, "Request already processed");

        request.status = RequestStatus.Rejected;

        emit MintRequestRejected(requestId, reason);
    }

    // Owner can still mint directly (backward compatibility)
    function safeMint(address to, string memory uri) public onlyOwner {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit ChainDeedMinted(to, tokenId, uri);
    }

    // Get all requests by a user
    function getUserRequests(address user) public view returns (uint256[] memory) {
        return userRequests[user];
    }

    // Get all pending requests (for owner dashboard)
    function getPendingRequests() public view returns (MintRequest[] memory) {
        uint256 pendingCount = 0;
        
        for (uint256 i = 0; i < allRequestIds.length; i++) {
            if (mintRequests[allRequestIds[i]].status == RequestStatus.Pending) {
                pendingCount++;
            }
        }

        MintRequest[] memory pending = new MintRequest[](pendingCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < allRequestIds.length; i++) {
            uint256 requestId = allRequestIds[i];
            if (mintRequests[requestId].status == RequestStatus.Pending) {
                pending[currentIndex] = mintRequests[requestId];
                currentIndex++;
            }
        }

        return pending;
    }

    // Get all requests (for admin view)
    function getAllRequests() public view returns (MintRequest[] memory) {
        MintRequest[] memory allRequests = new MintRequest[](allRequestIds.length);
        
        for (uint256 i = 0; i < allRequestIds.length; i++) {
            allRequests[i] = mintRequests[allRequestIds[i]];
        }

        return allRequests;
    }

    // Get request details
    function getRequest(uint256 requestId) public view returns (MintRequest memory) {
        require(mintRequests[requestId].requestId != 0, "Request does not exist");
        return mintRequests[requestId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function getTotalRequests() public view returns (uint256) {
        return _requestIdCounter;
    }
}
