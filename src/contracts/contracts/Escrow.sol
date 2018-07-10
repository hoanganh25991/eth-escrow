pragma solidity ^0.4.11;

contract Escrow {
  address public sellCoin;
  address public buyCoin;
  address public arbiter;
  
  constructor(
    address _sellCoin,
    address _buyCoin,
    address _arbiter
  )
  public
  payable
  {
    sellCoin = _sellCoin;
    buyCoin = _buyCoin;
    arbiter = _arbiter;
  }

  modifier isArbiter()
  {
    require(msg.sender == arbiter);
    _;
  }

  function accept()
  public 
  isArbiter
  {
    releaseEscrow();
  }

  
  function releaseEscrow() 
  private 
  isArbiter
  {
    buyCoin.transfer(address(this).balance);
  }
  
  function cancel()
  public
  isArbiter
  {
    selfdestruct(sellCoin);
  }
}