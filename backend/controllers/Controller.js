const clickhouseService = require('../services/clickhouseService');
const { manufacturerContract, consumerContract } = require('../services/blockchainService');
const { BigNumber } = require('ethers');

exports.createPill = async (req, res) => {
  const { manufacturer, SKU, quantity, productionDate } = req.body;

  try {
    
    console.log(`Received request to create pills: manufacturer=${manufacturer}, SKU=${SKU}, quantity=${quantity}, productionDate=${productionDate}`);
    const secrets = [];
    const transactionHashes = [];

    for (let i = 0; i < quantity; i++) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const tx = await manufacturerContract.createPills(SKU, currentTimestamp);
      await tx.wait();

      const secret = await manufacturerContract.getSecret(SKU, currentTimestamp);
      const transactionHash = tx.hash;

      console.log(`Pill with SKU: ${SKU} created. Secret: ${secret}. Transaction hash: ${tx.hash}`);

      await clickhouseService.insertPill({
        manufacturer,
        SKU,
        productionDate,
        secret,
        transactionHash,
        status: 0,
      });

      secrets.push(secret);
      transactionHashes.push(transactionHash);
    }

    res.send({ message: `Created ${quantity} pills with SKU ${SKU}`, secrets, transactionHashes });
  } catch (error) {
    console.error('Error creating pills:', error);
    res.status(500).send({ message: `Error creating pills: ${error.message}` });
  }
};

exports.getPillInfo = async (req, res) => {
  const { secret } = req.params;

  if (!secret) {
    console.error('Secret parameter is missing');
    return res.status(400).send({ message: 'Secret parameter is required' });
  }

  try {
    const clickhouseInfo = await clickhouseService.getPillInfo(secret);
    const pillInfo = await manufacturerContract.viewPillInfo(secret);
    const productionDate = BigNumber.from(pillInfo[3]).toNumber();
      
    if (!clickhouseInfo) {
      return res.status(404).send({ message: 'Pill not found in ClickHouse' });
    }

    const formattedPillInfo = {
      secret: pillInfo[0],
      status: pillInfo[1],
      consumedBy: pillInfo[2],
      productionDate: productionDate,
      blockchainManufacturer: pillInfo[4],
      clickhouseManufacturer: clickhouseInfo.manufacturer,
      SKU: clickhouseInfo.SKU 
    };

    console.log('Blockchain Pill Info:', pillInfo);
    console.log('ClickHouse Manufacturer Info:', clickhouseInfo);

    res.json(formattedPillInfo);

  } catch (error) {
    console.error('Error fetching pill info:', error);
    res.status(500).send({ message: 'Error fetching pill info' });
  }
};

exports.scanPill = async (req, res) => {
  const { secret, sku, timestamp } = req.body;

  if (!secret ||!sku || !timestamp) {
    return res.status(400).send({ message: 'Missing required parameters' });
  }

  try {
    const tx = await consumerContract.consumePill(sku, timestamp);
    await tx.wait();

    console.log(`Transaction successful: ${tx.hash}`);

    const pillInfo = await manufacturerContract.viewPillInfo(secret);
    console.log('Pill status from blockchain:', pillInfo);

    await clickhouseService.updatePillStatus(secret, 1);

    await clickhouseService.logQrScan({
      secret,
      scanTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 1
    });

    res.send({ message: `Pill with secret ${secret} scanned successfully`, transactionHash: tx.hash });
  } catch (error) {
    console.error('Error scanning pill:', error);
    res.status(500).send({ message: `Error scanning pill: ${error.message}` });
  }
};

// const clickhouseService = require('../services/clickhouseService');
// const { manufacturerContract, consumerContract } = require('../services/blockchainService');
// const { BigNumber } = require('ethers');

// exports.createPill = async (req, res) => {
//   const { manufacturer, SKU, quantity, productionDate } = req.body;

//   try {
    
//     console.log(`Received request to create pills: manufacturer=${manufacturer}, SKU=${SKU}, quantity=${quantity}, productionDate=${productionDate}`);
//     const secrets = [];
//     const transactionHashes = [];

//     for (let i = 0; i < quantity; i++) {
//       const currentTimestamp = Math.floor(Date.now() / 1000);
//       const tx = await manufacturerContract.createPills(SKU, currentTimestamp);
//       await tx.wait();

//       const secret = await manufacturerContract.getSecret(SKU, currentTimestamp);
//       const transactionHash = tx.hash;

//       console.log(`Pill with SKU: ${SKU} created. Secret: ${secret}. Transaction hash: ${tx.hash}`);

//       await clickhouseService.insertPill({
//         manufacturer,
//         SKU,
//         productionDate,
//         secret,
//         transactionHash,
//         status: 0,
//       });

//       secrets.push(secret);
//       transactionHashes.push(transactionHash);
//     }

//     res.send({ message: `Created ${quantity} pills with SKU ${SKU}`, secrets, transactionHashes });
//   } catch (error) {
//     console.error('Error creating pills:', error);
//     res.status(500).send({ message: `Error creating pills: ${error.message}` });
//   }
// };

// exports.getPillInfo = async (req, res) => {
//   const { secret } = req.params;

//   if (!secret) {
//     console.error('Secret parameter is missing');
//     return res.status(400).send({ message: 'Secret parameter is required' });
//   }

//   try {
//     const clickhouseInfo = await clickhouseService.getPillInfo(secret);
//     const pillInfo = await manufacturerContract.viewPillInfo(secret);
//     const productionDate = BigNumber.from(pillInfo[3]).toNumber();
      
//     if (!clickhouseInfo) {
//       return res.status(404).send({ message: 'Pill not found in ClickHouse' });
//     }

//     const formattedPillInfo = {
//       secret: pillInfo[0],
//       status: pillInfo[1],
//       consumedBy: pillInfo[2],
//       productionDate: productionDate,
//       blockchainManufacturer: pillInfo[4],
//       clickhouseManufacturer: clickhouseInfo.manufacturer,
//       SKU: clickhouseInfo.SKU 
//     };

//     console.log('Blockchain Pill Info:', pillInfo);
//     console.log('ClickHouse Manufacturer Info:', clickhouseInfo);

//     res.json(formattedPillInfo);

//   } catch (error) {
//     console.error('Error fetching pill info:', error);
//     res.status(500).send({ message: 'Error fetching pill info' });
//   }
// };


// exports.scanPill = async (req, res) => {
//   const { secret, sku, timestamp } = req.body;

//   if (!secret || !sku || !timestamp) {
//     return res.status(400).send({ message: 'Missing required parameters' });
//   }

//   try {
//     // Получаем информацию о таблетке
//     const pillInfo = await manufacturerContract.viewPillInfo(secret);
//     console.log('Pill status from blockchain:', pillInfo);

//     // Проверяем статус таблетки
//     if (pillInfo.status === 0) {
//       // Таблетка еще не потреблена, обновляем статус
//       const tx = await consumerContract.consumePill(sku, timestamp);
//       await tx.wait();
//       console.log(`Transaction successful: ${tx.hash}`);

//       // Обновляем статус в ClickHouse
//       await clickhouseService.updatePillStatus(secret, 1);

//       // Логируем сканирование QR-кода в ClickHouse
//       await clickhouseService.logQrScan({
//         secret,
//         scanTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
//         status: 1
//       });

//       return res.send({ message: `Pill with secret ${secret} scanned successfully`, transactionHash: tx.hash });
//     } else {
//       // Таблетка уже потреблена, просто возвращаем информацию
//       return res.send({ message: 'Pill is already consumed', pillInfo });
//     }
//   } catch (error) {
//     console.error('Error scanning pill:', error);
//     res.status(500).send({ message: `Error scanning pill: ${error.message}` });
//   }
// };