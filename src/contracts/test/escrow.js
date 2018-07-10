const Escrow = artifacts.require('./Escrow.sol');
const { log } = require('../../core/helpers');

const toEther = balance => web3.fromWei(balance.toNumber(), 'ether');
const toWei = eth => web3.toWei(eth, 'ether');
const getBalance = address => web3.eth.getBalance(address);

contract('Escrow', accounts => {
  describe('Release', () => {
    const sentCoin = toWei(10);
    const sellCoin = accounts[0];
    const buyCoin = accounts[1];
    const arbiter = accounts[2];
    const badGuy = accounts[3];

    const buyerBalance = {
      before: null,
      after: null
    };

    it('Should release when arbiter accept', async () => {
      Escrow.defaults({ from: sellCoin });
      buyerBalance.before = await getBalance(buyCoin);

      const instance = await Escrow.new(buyCoin, arbiter, { value: sentCoin });
      await instance.accept({ from: arbiter });

      buyerBalance.after = await getBalance(buyCoin);
      const { before, after } = buyerBalance;
      log('[buyerBalance] before:', toEther(before), 'ETH');
      log('[buyerBalance] after:', toEther(after), 'ETH');
      assert(before.add(sentCoin).eq(after));
    });

    it('Should prevent accept from others', async () => {
      try {
        buyerBalance.before = await getBalance(buyCoin);
        const instance = await Escrow.new(buyCoin, arbiter, { value: sentCoin });
        await instance.accept({ from: badGuy });
      }catch(err){
        buyerBalance.after = await getBalance(buyCoin);
        const { before, after } = buyerBalance;
        log('[buyerBalance] before:', toEther(before), 'ETH');
        log('[buyerBalance] after:', toEther(after), 'ETH');
        assert.match(err.message, /VM Exception/);
        assert(before.eq(after));
      }
    });
  });
});
