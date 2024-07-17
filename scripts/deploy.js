async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", await deployer.getAddress());
  
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    
    const Manufacturer = await ethers.getContractFactory("Manufacturer", deployer);
    const manufacturer = await Manufacturer.deploy("CompanyName");
    await manufacturer.waitForDeployment();

    const manufacturercontractAddress = await manufacturer.getAddress();
    console.log("Manufacturer contract deployed to:", manufacturercontractAddress);

    const Consumer = await ethers.getContractFactory("Consumer", deployer);
    const consumer = await Consumer.deploy(manufacturercontractAddress);
    await consumer.waitForDeployment();

    const consumercontractAddress = await consumer.getAddress();
    console.log("Consumer contract deployed to:", consumercontractAddress);

    console.log("Add the following lines to your .env file:");
    console.log("MANUFACTURER_CONTRACT_ADDRESS:", manufacturercontractAddress);
    console.log("CONSUMER_CONTRACT_ADDRESS", consumercontractAddress); 
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  