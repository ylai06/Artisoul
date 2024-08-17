//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    //_tokenIds variable has the most recent minted tokenId
    uint256 private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    uint256 private _itemsSold;
    //owner is the contract address that created the smart contract
    // address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.00001 ether;

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor(
        address initialOwner
    ) ERC721("NFTMarketplace", "NFTM") Ownable(initialOwner) {}

    //This function is used to update the listing price of the NFTs
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner() == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    //This function is used to get the current listing price of the NFTs
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    //This function is used to get the latest tokenId and return the details of the token
    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds; // get the latest tokenId
        return idToListedToken[currentTokenId];
    }

    //This function is used to get the details of a token by passing a tokenId
    function getListedTokenForId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    //This function is used to get the current token Id
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds;
    }

    //The first time a token is created, it is listed here
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        //Make sure the sender sent enough ETH to pay for listing
        require(price > 0, "Price must be greater than 0");
        require(
            msg.value == listPrice,
            "Please submit the listing fee in order to list your NFT"
        );

        _tokenIds++; //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        uint256 curTokenId = _tokenIds;

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, curTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(curTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(curTokenId, price);

        return curTokenId;
    }

    //This function is used to list a token on the marketplace, and no need to called by frontend(private)
    function createListedToken(uint256 tokenId, uint256 price) private {
        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    //First run a loop to get the count and then create an array to store the listed tokens
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds;
        ListedToken[] memory tokens = new ListedToken[](nftCount); // create an array of tokens
        uint currentIndex = 0;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will
        //filter out currentlyListed == false over here
        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId]; // NFT objects
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold++;

        //Actually transfer the token from current address to the new owner(msg.sender)
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Important to emit an event for the frontend to update the user
        //Transfer the listing fee to the marketplace creator
        payable(owner()).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    function mintNFT(
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds++;

        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    //We might add a resell token function in the future
    //In that case, tokens won't be listed by default but users can send a request to actually list a token
    //Currently NFTs are listed by default
}
