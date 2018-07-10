/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const HDWalletProvider = require('truffle-hdwallet-provider');
const { MNEMONIC } = process.env;

module.exports = {
  development: {
    host: 'localhost',
    port: 8545,
    network_id: '*'
  },
  ropsten: {
    provider: function() { 
      if(!MNEMONIC) throw new Error('Please provide \'mnemonic\' to deploy.');
      return new HDWalletProvider(MNEMONIC, 'https://ropsten.infura.io/ur47Lz3XILJxaexyGLCi'); 
    },
    network_id: '1',
    gas: 4500000,
    gasPrice: 10000000000,
  },
  mainnet: {
    provider: function() { 
      if(!MNEMONIC) throw new Error('Please provide \'mnemonic\' to deploy.');
      return new HDWalletProvider(MNEMONIC, 'https://mainnet.infura.io/ur47Lz3XILJxaexyGLCi'); 
    },
    network_id: '1',
    gas: 4500000,
    gasPrice: 10000000000,
  },
};
