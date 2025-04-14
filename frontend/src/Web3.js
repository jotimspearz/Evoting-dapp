import Web3 from 'web3';
import Voting from './contracts/Voting.json'; // Import ABI

// Initialize Web3 and the contract
let web3;
let votingContract;
let account;

const initializeWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Request wallet access
  } else {
    alert('Please install MetaMask to interact with this app');
  }
};

const getContract = (contractAddress) => {
  if (!web3) {
    throw new Error('Web3 not initialized');
  }

  if (!votingContract) {
    // Initialize the contract if not already initialized
    votingContract = new web3.eth.Contract(
      Voting.abi,
      contractAddress
    );
  }

  return votingContract;
};

const getAccount = async () => {
  if (!account) {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0]; // Store the first account
  }
  return account;
};

// Utility function to get contract info
const getCandidates = async (contractAddress) => {
  const contract = getContract(contractAddress);
  const totalCandidates = await contract.methods.candidatesCount().call();
  const candidates = [];
  
  for (let i = 1; i <= totalCandidates; i++) {
    const candidate = await contract.methods.candidates(i).call();
    candidates.push(candidate);
  }

  return candidates;
};

// Utility function to add a candidate
const addCandidate = async (contractAddress, candidateName) => {
  const contract = getContract(contractAddress);
  const account = await getAccount();

  await contract.methods.addCandidate(candidateName).send({
    from: account,
    gas: 2000000, // Set the appropriate gas limit
    gasPrice: web3.utils.toWei('20', 'gwei'), // Legacy mode for gasPrice
  });
};

export { initializeWeb3, getCandidates, addCandidate };
