const { ethers, JsonRpcProvider } = require('ethers');
const clickhouseService = require('../services/clickhouseService');

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

// const pills = {}; // to save PillBook in the memory 

exports.createPill = async (req, res) => {
  const { login, manufacturer, SKU, quantity, productionDate } = req.body;

  try {

    console.log(`Received request to create pills: login=${login}, manufacturer=${manufacturer}, SKU=${SKU}, quantity=${quantity}, productionDate=${productionDate}`);
    const secrets = [];
    const transactionHashes = [];

    for (let i = 0; i < quantity; i++) {
      const currentTimestamp = Math.floor(Date.now()); // Get the current timestamp in milliseconds
      
      const productionSequence = await manufacturerContract.productionSequence();
      console.log(`Production sequence: ${productionSequence}`);

      const tx = await manufacturerContract.createPills(SKU, currentTimestamp);
      const receipt = await tx.wait();

      const secret = await manufacturerContract.getSecret(productionSequence, SKU, currentTimestamp);
      const transactionHash = tx.hash;

      console.log(`Pill with SKU: ${SKU} created. Secret: ${secret}. Transaction hash: ${tx.hash}`);
      //await manufacturerContract.createPills(SKU);
    
 
      await clickhouseService.insertPill({
        manufacturer,
        SKU,
        productionDate,
        secret,
        transactionHash,
        status: 0,
        login//: login || 'default_login'
      });

      secrets.push(secret);
      transactionHashes.push(transactionHash);
    }

    res.send({ message: `Created ${quantity} pills with SKU ${SKU}` , secrets, transactionHashes });
  } catch (error) {
    console.error('Error creating pills:', error);
    res.status(500).send({ message: `Error creating pills: ${error.message}` });
  }
};


exports.getPillInfo = async (req, res) => {
  const { secret } = req.params;

  // console.log(`Received request to fetch pill info for secret: ${secret}`);
  
  try {
    const pillInfo = await clickhouseService.getPillInfo(secret);

    if (!pillInfo) {
      // console.log(`Pill not found for secret: ${secret}`);
      return res.status(404).send({ message: 'Pill not found' });
    }

    console.log('Pill info:', JSON.stringify(pillInfo, null, 2));
    res.json(pillInfo);

  } catch (error) {
    console.error('Error fetching pill info:', error);
    res.status(500).send({ message: 'Error fetching pill info' });
  }
};


exports.scanPill = async (req, res) => {
  const { secret } = req.body;

  try {
      const tx = await consumerContract.consumePill(secret);
      const receipt = await tx.wait();

      console.log(`Pill with secret: ${secret} scanned. Transaction hash: ${tx.hash}`);

      res.send({ message: `Pill with secret ${secret} scanned successfully`, transactionHash: tx.hash });
  } catch (error) {
      console.error('Error scanning pill:', error);
      res.status(500).send({ message: `Error scanning pill: ${error.message}` });
  }
};

exports.login = async (req, res) => {
  res.status(501).send({ message: 'Not Implemented' });
};

exports.register = async (req, res) => {
  res.status(501).send({ message: 'Not Implemented' });
};
