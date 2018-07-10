const EscrowJson = require('../contracts/build/contracts/Escrow.json');

const { log } = require('../core/helpers');

const deployEscrow = (web3, _buyer, _arbiter) => {
  const Escrow = new web3.eth.contract(EscrowJson.abi);
  // const tx = Contract.deploy({
  //   data: '0x' + Escrow.data,
  //   arguments: [_buyer, _arbiter]
  // }).send({ gas: 4612388, from: web3.eth.defaultAccount });
  const sellCoin =  web3.eth.defaultAccount;

  return new Promise((resolve, reject) => {
    Escrow.new(_buyer, _arbiter, {
      gas: 4612388,
      from: sellCoin}, (err, contract) => {
      if(err) return reject(err);
      
      if(!err) {
        log('[deployEscrow] contract.address:', contract.address);
        log('[deployEscrow] contract.transactionHash:', contract.transactionHash);
        return resolve(contract);
      }
    });
  });
};