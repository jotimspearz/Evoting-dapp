import React, { useState, useEffect } from 'react';
import { initializeWeb3, getCandidates, addCandidate } from '../Web3';

const Results = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contractAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab'; // Replace with your deployed contract address

  useEffect(() => {
    initializeWeb3().then(() => {
      setIsConnected(true);
      fetchCandidates();
    }).catch(err => {
      setError('Failed to connect wallet');
      console.error(err);
    });
  }, []);

  // Function to fetch candidates
  const fetchCandidates = async () => {
    try {
      const candidatesList = await getCandidates(contractAddress);
      setCandidates(candidatesList);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch candidates');
    }
  };

  const handleAddCandidate = async () => {
    if (!candidateName) {
      setStatusMessage('Please enter a candidate name');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Adding candidate...');

    try {
      await addCandidate(contractAddress, candidateName);
      setStatusMessage(`Candidate "${candidateName}" added successfully!`);
      setCandidateName('');
      fetchCandidates(); // Refresh the list of candidates
    } catch (error) {
      setStatusMessage('Error adding candidate');
      console.error(error);
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      {!isConnected ? (
        <div>
          <button onClick={initializeWeb3}>Connect MetaMask</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <p>Network ID: {network}</p>

          <div>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
            />
            <button onClick={handleAddCandidate} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Candidate'}
            </button>
            {statusMessage && <p>{statusMessage}</p>}
          </div>

          <h2>Candidates</h2>
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                <strong>{candidate.name}</strong> - Votes: {candidate.voteCount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Results;

