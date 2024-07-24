const { ethers } = require("hardhat");
// const fs = require("fs");

async function main() {
  // const [deployer] = await ethers.getSigners();
  // const balance = await deployer.getBalance();

  const [deployer] = await ethers.getSigners();

  const MyNFT = await ethers.getContractFactory("MyNFT"); // create a contract factory
  const myNFT = await MyNFT.deploy(deployer.address);
  await myNFT.waitForDeployment();

  console.log("Contract deployed to address:", myNFT.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
