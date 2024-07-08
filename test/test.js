const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manufacturer Contract", function () {
  let Manufacturer, manufacturer, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Manufacturer = await ethers.getContractFactory("Manufacturer", owner);
    manufacturer = await Manufacturer.deploy();
    await manufacturer.waitForDeployment(); 
    // console.log("Manufacturer deployment transaction:", manufacturer.deploymentTransaction());
  });

  it("Should deploy smart contract properly", async function () {
    expect(manufacturer.getAddress()).to.not.equal("");
  });

  it("Company Name is Correctly set", async function () {
    const companyName = await manufacturer.company();
    expect(companyName).to.equal("PharmaCompany");
  });

  it("Pill creation is happening", async function () {
    const currentTimestamp = Date.now();
    await manufacturer.createPills("SKU123", currentTimestamp);
    const pillInfo = await manufacturer.viewPillInfo(1, "SKU123", currentTimestamp);
    expect(pillInfo[0]).to.equal(1);
    expect(pillInfo[1]).to.equal(0);
    expect(pillInfo[3]).to.equal("SKU123");
  });

  it("Secret is correctly generated during pill creation", async function () {
    const currentTimestamp = Date.now();
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secretFromContract = await manufacturer.getSecret(1, "SKU123", currentTimestamp);
    const expectedSecret = ethers.solidityPackedKeccak256(["uint256", "string", "uint256"], [1, "SKU123", currentTimestamp]);
    expect(secretFromContract).to.equal(expectedSecret);
  });

  it("Should set pill in transit", async function () {
    const currentTimestamp = Date.now();
    await manufacturer.createPills("SKU123", currentTimestamp);
    await manufacturer.setPillInTransit(1, "SKU123", currentTimestamp);
    const pillInfo = await manufacturer.viewPillInfo(1, "SKU123", currentTimestamp);
    expect(pillInfo[1]).to.equal(2); 
  });

  it("Should consume pill", async function () {
    const currentTimestamp = Date.now();
    await manufacturer.createPills("SKU123", currentTimestamp);
    await manufacturer.consumePill(1, "SKU123", currentTimestamp, addr1.address);
    const pillInfo = await manufacturer.viewPillInfo(1, "SKU123", currentTimestamp);
    expect(pillInfo[1]).to.equal(1); 
    expect(pillInfo[2]).to.equal(addr1.address); 
  });

});

describe("Consumer Contract", function () {

  let Manufacturer, Consumer, manufacturer, consumer, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Manufacturer = await ethers.getContractFactory("Manufacturer", owner);
    manufacturer = await Manufacturer.deploy();
    await manufacturer.waitForDeployment();
    const manufacturerAddress = await manufacturer.getAddress();
    // console.log("Manufacturer contract deployed to:", manufacturerAddress);

    Consumer = await ethers.getContractFactory("Consumer", owner);
    consumer = await Consumer.deploy(manufacturerAddress);
    await consumer.waitForDeployment();
    const consumerAddress = await consumer.getAddress();
    // console.log("Consumer deployed to:", consumerAddress); 
  });

  it("Should deploy smart contract properly", async function () {
    expect(await consumer.getAddress()).to.not.equal("");
  });

  it("Should be able to consume Pills", async function () {
    const currentTimestamp = Date.now();
    await manufacturer.createPills("SKU123", currentTimestamp);
    const pillInfoBefore = await manufacturer.viewPillInfo(1, "SKU123", currentTimestamp);
    expect(pillInfoBefore[1]).to.equal(0);

    await consumer.consumePill(1, "SKU123", currentTimestamp, { value: ethers.parseEther("1") });  
    const pillInfoAfter = await manufacturer.viewPillInfo(1, "SKU123", currentTimestamp);
    expect(pillInfoAfter[1]).to.equal(1);

  });

  it("keccak256 Function is working fine", async function () {
    const byterReturn = await consumer.keccakOfNumber(1);
    const expectedKeccak = ethers.solidityPackedKeccak256(["uint256"], [1]);
    expect(byterReturn).to.equal(expectedKeccak); 
  });
  
});

