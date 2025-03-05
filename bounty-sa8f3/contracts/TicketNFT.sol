// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId; // Auto-incremented token ID

    event TicketPurchased(address indexed buyer, uint256 amount, string transactionHash);

    constructor() ERC721("TicketNFT", "TKT") Ownable(msg.sender) {
        _nextTokenId = 1; // Start from 1 instead of 0
    }

    // ✅ Mint function remains UNCHANGED
    function mintTicket(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;  // Get the current token ID
        _nextTokenId++;                  // Increment for next minting

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId; // Return the tokenId
    }

    // ✅ Buy Ticket function (Uses Transaction Hash Instead of Token ID)
    function buyTicket() public payable {
        require(msg.value > 0, "Payment required");

        // Funds go to the contract owner
        payable(owner()).transfer(msg.value);

        // Emit event with the transaction hash (Fetched from backend)
        emit TicketPurchased(msg.sender, msg.value, "tx_hash_not_available_in_solidity");
    }
}
