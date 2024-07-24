/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { API_URL, PRIVATE_KEY_1 } = process.env;

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY_1}`],
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
  sourcify: {
    enabled: true
  },
};
