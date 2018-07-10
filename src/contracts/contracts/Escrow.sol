pragma solidity ^0.4.11;
contract Escrow {
  uint TIMEOUT = 1 days;
  uint LOCK_TIME = 2 hours;

  uint balance;
  address public sellCoin;
  address public buyCoin;
  address public arbiter;
  
  address private escrow;
  uint private created_timestamp;
  
  bool acceptedByArbiter;

  bool sellCancel;
  bool buyCancel;


    
  function Escrow(address _sellCoin, address _buyCoin, address _arbiter) public payable {
    // this is the constructor function that runs ONCE upon initialization
    //now is an alias for block.timestamp, not really "now"
    sellCoin = _sellCoin;
    buyCoin = _buyCoin;
    arbiter =_arbiter
    created_timestamp = now; 
  }
  
  function accept() public {
    if(msg.sender == arbiter){
      acceptedByArbiter = true;
    }

    if(acceptedByArbiter){
      releaseEscrow();
    }

    if(now > created_timestamp + TIMEOUT) {
      // Freeze X days before release to sellCoin.
      // The sellCoin has to remember to call this method after freeze period.
      selfdestruct(sellCoin);
    }
  }

  
  function releaseEscrow() private {
    // Pay a fee (1%) for arbiter
    // send buyCoin the balance
    arbiter.send(this.balance / 100);
    if (buyCoin.send(this.balance)) {
      balance = 0;
    } else {
      throw;
    }
  }
  
  function deposit() public payable {
    if (msg.sender == sellCoin) {
      balance += msg.value;
    }
  }
  
  function cancel() public {
    if(now < created_timestamp + LOCK_TIME) {
      return;
    }

    if (msg.sender == sellCoin){
      sellCancel = true;
    } else if (msg.sender == buyCoin){
      buyCancel = true;
    }
    // if both sellCoin and buyCoin would like to cancel
    // money is returned to sellCoin 
    if (sellCancel && buyCancel){
        selfdestruct(sellCoin);
    }
  }
  
  function kill() public constant {
    // Arbiter decide to cancel contract 
    if (msg.sender == arbiter) {
        selfdestruct(sellCoin);
    }
  }
}