require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-waffle");

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY


module.exports = {
  solidity: "0.8.4",

networks:{
  goerli: {
    url: ALCHEMY_API_KEY_URL,
    accounts: [PRIVATE_KEY],
  },
} 

};
