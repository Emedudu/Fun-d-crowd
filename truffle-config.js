require('babel-register');
require('babel-polyfill');
require('dotenv').config();
var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var polygon_key= process.env.POLYGON_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    mumbai_alchemy: {
      networkCheckTimeout:100000,
      provider: function() { 
       return new HDWalletProvider(mnemonic, polygon_key);
      },
      network_id: 80001,
      // gas: 6700000,
      // gasPrice: 1000000000
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:"^0.8.0",
      settings:{
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
