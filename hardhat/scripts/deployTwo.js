const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants"); 



async function main() {

  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;

  const metadataURL = METADATA_URL;
  
  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");


  const deployedCryptoDevsContract = await cryptoDevsContract.deploy(
    metadataURL,
    whitelistContract
  );

  console.log(
    "Crypto Devs Contract Address:",
    deployedCryptoDevsContract.address
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
 
  // 0xbF8219d0736c9BC34DeAaF8f3aE72C0f7EaF06fd

  // quicknode address 0x92eab1e234dee6f2E3Cf4d1B0E3215E2Ebf2C144
