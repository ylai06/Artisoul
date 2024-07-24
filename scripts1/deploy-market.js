const { ethers } = require("hardhat");
const hre = require("hardhat");
// const fs = require("fs");

async function main() {
  // const balance = await deployer.getBalance();
  // const [deployer] = await ethers.getSigners();
  const [deployer] = await ethers.getSigners();
  const Marketplace = await ethers.getContractFactory("NFTMarketplace"); // create a contract factory
  const marketplace = await Marketplace.deploy(deployer.address);

  await marketplace.waitForDeployment();
  // await marketplace.deployed();

  console.log("NFT marketplace Contract deployed to address:", marketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
