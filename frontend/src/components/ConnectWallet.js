// ConnectWallet.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';




const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed and available
  useEffect(() => {
    if (window.ethereum) {
      // Listen for account change
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // Listen for network change
      window.ethereum.on('chainChanged', (chainId) => {
        setNetwork(chainId);
      });
    }
  }, []);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // Set the connected account and update state
        setAccount(accounts[0]);

        // Get the network the user is connected to
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        setNetwork(networkId);

        setIsConnected(true);
      } else {
        setError('Please install MetaMask to connect your wallet.');
      }
    } catch (err) {
      setError('Failed to connect wallet.');
      console.error(err);
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
    setIsConnected(false);
  };

  return (
    <div>
      {!isConnected ? (
        <div className='connected'>
          <button onClick={connectWallet}>Connect MetaMask</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <div className='connected'>
        <button onClick={disconnectWallet}>Disconnect</button>
          <span>Connected Account: </span>
          <p>{account}</p>
          <span>Network ID:</span>
          <p>{network}</p>
          
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
