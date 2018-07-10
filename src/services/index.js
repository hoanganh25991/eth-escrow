import EscrowJson from '../contracts/build/contracts/Escrow.json';
// import curry from 'lodash.curry';
import { log } from '../core/helpers';

const deplay = time => new Promise(rsl => setTimeout(rsl, time));

const waitBlock = async (web3, tx) => {
  let contractAddress = null;
  while (!contractAddress) {
    const receipt = await new Promise(resolve => web3.eth.getTransactionReceipt(tx, (err, receipt) => resolve(receipt)));
    contractAddress = receipt && receipt.contractAddress;
    await deplay(4000);
  }
  return contractAddress;
};

const deployEscrow = async (web3, _buyer, _arbiter, _coin, callback) => {
  const Escrow = web3.eth.contract(EscrowJson.abi);
  const sellCoin = web3.eth.defaultAccount;
  const coinInWei = web3.toWei(_coin, 'ether');
  const gasPrice = web3.toWei(0.001, 'GWei');

  const contract = await new Promise((resolve, reject) => {
    Escrow.new(
      _buyer,
      _arbiter,
      {
        data: EscrowJson.bytecode,
        gas: 4612388,
        gasPrice, 
        from: sellCoin,
        value: coinInWei
      },
      (err, contract) => {
        if (err) return reject(err);

        if (!err) {
          log('[deployEscrow] contract.address:', contract.address);
          log('[deployEscrow] contract.transactionHash:', contract.transactionHash);
          callback({ transactionHash: contract.transactionHash});
          resolve(contract);
        }
      }
    );
  });

  const tx = contract.transactionHash;
  const contractAddress = await waitBlock(web3, tx);
  log('[contractAddress]', contractAddress);
  return Escrow.at(contractAddress);
};

const acceptToRelease = (web3, contract) => {
  const arbiter = web3.eth.defaultAccount;
  return new Promise((resolve, reject) => {
    contract.accept({from: arbiter}, (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
};

const checkBalance = (web3, address) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (err, balance) => {
      if(err) return reject(err);
      const eth = web3.fromWei(balance.toNumber(), 'ether');
      resolve(eth);
    });
  });
};

export { deployEscrow, acceptToRelease, checkBalance };
