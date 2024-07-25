const { ethers } = require('ethers');
require('dotenv').config();

const MANUFACTURER_ABI = require('../../artifacts/contracts/Manufacturer.sol/Manufacturer.json').abi;
const MANUFACTURER_CONTRACT_ADDRESS = process.env.MANUFACTURER_CONTRACT_ADDRESS;

const CONSUMER_ABI = require('../../artifacts/contracts/Consumer.sol/Consumer.json').abi;
const CONSUMER_CONTRACT_ADDRESS = process.env.CONSUMER_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const manufacturerPrivateKey = process.env.MANUFACTURER_PRIVATE_KEY;
const consumerPrivateKey = process.env.CONSUMER_PRIVATE_KEY;
const signer = new ethers.Wallet(manufacturerPrivateKey, provider); // manufacturer
const consumerWallet = new ethers.Wallet(consumerPrivateKey, provider);

const manufacturerContract = new ethers.Contract(MANUFACTURER_CONTRACT_ADDRESS, MANUFACTURER_ABI, signer);
const consumerContract = new ethers.Contract(CONSUMER_CONTRACT_ADDRESS, CONSUMER_ABI, consumerWallet);
module.exports = {
  manufacturerContract,
  consumerContract,
};
