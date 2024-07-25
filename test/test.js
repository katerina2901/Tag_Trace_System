const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manufacturer Contract", function () {
  let Manufacturer, manufacturer, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Manufacturer = await ethers.getContractFactory("Manufacturer", owner);
    manufacturer = await Manufacturer.deploy("PharmaCompany");
    await manufacturer.waitForDeployment(); 
  });

  it("Should deploy smart contract properly", async function () {
    expect(manufacturer.getAddress()).to.not.equal("");
  });

  it("Company Name is Correctly set", async function () {
    const companyName = await manufacturer.company();
    expect(companyName).to.equal("PharmaCompany");
  });

  it("Pill creation is happening", async function () {
    const currentTimestamp = Math.floor(Date.now());
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secret = await manufacturer.getSecret("SKU123", currentTimestamp);
    const pillInfo = await manufacturer.viewPillInfo(secret);
    expect(pillInfo[0]).to.equal(secret);
    expect(pillInfo[1]).to.equal(0); // status
    expect(pillInfo[3]).to.equal(currentTimestamp); // productionDate
  });

  it("Secret is correctly generated during pill creation", async function () {
    const currentTimestamp = Math.floor(Date.now());
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secretFromContract = await manufacturer.getSecret("SKU123", currentTimestamp);
    const expectedSecret = ethers.solidityPackedKeccak256(["string", "uint256"], ["SKU123", currentTimestamp]);
    expect(secretFromContract).to.equal(expectedSecret);
  });

  it("Should set pill in transit", async function () {
    const currentTimestamp = Math.floor(Date.now());
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secret = await manufacturer.getSecret("SKU123", currentTimestamp);
    await manufacturer.setPillInTransit("SKU123", currentTimestamp);
    const pillInfo = await manufacturer.viewPillInfo(secret);
    expect(pillInfo[1]).to.equal(2); //status
  });

  it("Should consume pill", async function () {
    const currentTimestamp = Math.floor(Date.now());
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secret = await manufacturer.getSecret("SKU123", currentTimestamp);
    await manufacturer.consumePill("SKU123", currentTimestamp, addr1.address);
    const pillInfo = await manufacturer.viewPillInfo(secret);
    expect(pillInfo[1]).to.equal(1); // status
    expect(pillInfo[2]).to.equal(addr1.address); //consumedBy
  });

});

describe("Consumer Contract", function () {

  let Manufacturer, Consumer, manufacturer, consumer, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Manufacturer = await ethers.getContractFactory("Manufacturer", owner);
    manufacturer = await Manufacturer.deploy("PharmaCompany");
    await manufacturer.waitForDeployment();
    const manufacturerAddress = await manufacturer.getAddress();

    Consumer = await ethers.getContractFactory("Consumer", owner);
    consumer = await Consumer.deploy(manufacturerAddress);
    await consumer.waitForDeployment();
  });

  it("Should deploy smart contract properly", async function () {
    expect(await consumer.getAddress()).to.not.equal("");
  });

  it("Should be able to consume Pills", async function () {
    const currentTimestamp = Math.floor(Date.now());
    await manufacturer.createPills("SKU123", currentTimestamp);
    const secret = await manufacturer.getSecret("SKU123", currentTimestamp);
    const pillInfoBefore = await manufacturer.viewPillInfo(secret);
    expect(pillInfoBefore[1]).to.equal(0); //status

    await consumer.consumePill("SKU123", currentTimestamp, { value: ethers.parseEther("1") });  
    const pillInfoAfter = await manufacturer.viewPillInfo(secret);
    expect(pillInfoAfter[1]).to.equal(1); //status

  });


  it("keccak256 Function is working fine", async function () {
    const byterReturn = await consumer.keccakOfNumber(1);
    const expectedKeccak = ethers.solidityPackedKeccak256(["uint256"], [1]);
    expect(byterReturn).to.equal(expectedKeccak); 
  });
  
});

