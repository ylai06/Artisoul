require("dotenv").config();
const { ethers } = require("hardhat");

// Get Alchemy API Key
const { API_KEY, PRIVATE_KEY_1, PRIVATE_KEY_2 } = process.env;

// Define an Alchemy Provider
const provider = new ethers.AlchemyProvider("sepolia", API_KEY);
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

// Create a signer
const signer = new ethers.Wallet(PRIVATE_KEY_1, provider);

// Get contract ABI and address
const abi = contract.abi;
const contractAddress = "0x335363570bCc5a4bc3E5AA3b0AffB418f5602dca";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);
console.log("Contract Address:", myNftContract.target);

// Get the NFT Metadata IPFS URL
const tokenUri =
  "https://solidweb.me/NFT-asset/my-solid-app/a7f60ad3-691c-45af-89f9-d495b8dace26/";

// Call mintNFT function
const mintNFT = async () => {
  let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
  await nftTxn.wait();
  console.log(
    `NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
  );
  console.log("NFT token", nftTxn);
};

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
