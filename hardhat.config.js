require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config();


/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts:  [`0x${process.env.MANUFACTURER_PRIVATE_KEY}`, `0x${process.env.CONSUMER_PRIVATE_KEY}`]
      //timeout: 100000,
    }
  }
};
