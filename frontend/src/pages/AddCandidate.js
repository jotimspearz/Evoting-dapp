// AddCandidate.js
import React, { useState } from 'react';
import Web3 from 'web3';
import Voting from '../contracts/Voting.json'; // Adjust path to your ABI file

const AddCandidate = () => {
  const [candidateNames, setCandidateNames] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Web3 initialization
  const web3 = new Web3(window.ethereum); // Use MetaMask provider
  const contractAddress = '0x6909c5340cD84C69C91730b85652efcBf93562B9'; 
  const votingContract = new web3.eth.Contract(Voting.abi, contractAddress);

  // Function to handle adding a candidate
  const handleSubmit = async () => {
    e.preventDefault();
    if (!name || !party || !image) {
      setMessage('Please fill all fields.');
      return;
    }
  
    setIsSubmitting(true);
    setStatusMessage('Adding candidate...');
  
    try {
      const accounts = await web3.eth.getAccounts();
      
      // Send the transaction using legacy gasPrice (not EIP-1559)
      await votingContract.methods.addCandidate(candidateNames).send({
        from: accounts[0],
        gas: 2000000, // Set an appropriate gas limit
        gasPrice: web3.utils.toWei('20', 'gwei'), // Use gasPrice instead of maxFeePerGas (legacy mode)
      });
  
      setStatusMessage(`Candidate "${candidateNames}" added successfully!`);
      setCandidateNames(''); // Clear input after successful addition
    } catch (error) {
      console.error(error);
      setStatusMessage('Error adding candidate');
    }
  
    setIsSubmitting(false);
  };
  
  return (
    <div>
      <h2>Add Candidate</h2>
      <input
        type="text"
        value={candidateNames}
        onChange={(e) => setCandidateNames(e.target.value)}
        placeholder="Enter candidate name"
      />
      <button onClick={addCandidate} disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Candidate'}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default AddCandidate;
