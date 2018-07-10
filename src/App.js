import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import {  log } from './core/helpers';
import { deployEscrow, acceptToRelease, checkBalance } from './services';

const ROPSTEN_URL = 'https://ropsten.etherscan.io';

const newTab = (href, content) => (<a target="_blank" rel="noopener noreferrer" href={href}>{content}</a>);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      buyerAddress: '0x3A826a4695a416bbC7FBe702Dc1730942B518476',
      arbiterAddress: '0x827746d6b67E98F88D037d1a19698113724CBF5b',
      totalCoin: 0.1,
      isCreating: null,
      transactionHash: null,
      tranferToBuyerTx: null,
    };
  }

  componentDidMount() {
    const web3 = window.web3;
    this.setState({ web3 });
  }

  update = key => e => {
    this.setState({ [key]: e.target.value });
  };

  createEscrow = async e => {
    this.setState({isCreating: true});
    try {
      e.preventDefault();
      const { web3, buyerAddress, arbiterAddress, totalCoin } = this.state;
      const escrow = await deployEscrow(web3, buyerAddress, arbiterAddress, totalCoin, this.setState.bind(this));
      log(escrow);
      this.setState({escrow, isCreating: false});
    } catch (err) {
      log(err.message);
    }
  };

  accept = async e => {
    this.setState({isAccepting: true});
    try{
      e.preventDefault();
      window.alert('Only arbiter can accept to release');
      const { escrow, web3 } = this.state;
      const result = await acceptToRelease(web3, escrow);
      this.setState({tranferToBuyerTx: result});
    }catch(err){
      log(err.message);
    }
  }

  check = address => async e => {
    try {
      e.preventDefault();
      console.log(address);
      const { web3 } = this.state;
      const balance = await checkBalance(web3, address);
      window.alert(`Balance: ${balance}`);
    }catch(err){
      log(err.message);
    }
  }

  render() {
    const { web3, buyerAddress, arbiterAddress, totalCoin, isCreating, transactionHash, escrow, tranferToBuyerTx } = this.state;
    return (
      <div>
        {!web3 && (
          <Fragment>
            <h1>Please install MeatMask which helps to interact with your wallet</h1>
          </Fragment>
        )}
        {web3 && (
          <Fragment>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <div className="section">
              <h3>Escrow Contract</h3>
              { isCreating && <Fragment>
                <p className="status">Waiting for create smart contract...</p>
                {transactionHash && <p className="status">{newTab(`${ROPSTEN_URL}/tx/${transactionHash}`, `Pending Transaction: ${transactionHash}`)}</p>}
              </Fragment>}
              <div>
                <div className="label">Buyer</div>                 
                <input
                  type="text"
                  placeholder="Buyer Address"
                  value={buyerAddress}
                  onChange={this.update('buyerAddress')}
                />
              </div>
              <div>
                <div className="label">Arbiter</div>                
                <input
                  type="text"
                  placeholder="Arbiter Address"
                  value={arbiterAddress}
                  onChange={this.update('arbiterAddress')}
                />
              </div>
              <div>
                <div className="label">Coin</div>     
                <input
                  type="text"
                  placeholder="Total Coin"
                  value={totalCoin}
                  onChange={this.update('totalCoin')}
                />
              </div>
              <button onClick={this.createEscrow}>Create</button>
            </div>

            <div className="section">
              <h3>Arbiter</h3>
              { escrow && <Fragment>
                <p>{newTab(`${ROPSTEN_URL}/address/${escrow.address}`, `Contract: ${escrow.address}`)}</p>
              </Fragment>}
              <button
                onClick={this.accept}
              >
                Accept
              </button>
            </div>

            <div className="section">
              <h3>Buyer</h3>
              {tranferToBuyerTx && <Fragment>
                <p>Transferred to buyer</p>
                <p>{newTab(`${ROPSTEN_URL}/tx/${tranferToBuyerTx}`, `Pending Transaction: ${tranferToBuyerTx}`)}</p>
              </Fragment>}
              <button
                onClick={this.check(this.state.buyerAddress)}
              >
                Check Buyer Balance
              </button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
