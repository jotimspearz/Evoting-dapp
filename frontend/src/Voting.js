import Web3 from "web3";
import { useEffect, useState } from "react";
import VotingContract from "./contracts/Voting.json";


const Voting = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3);

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        if (deployedNetwork) {
          const contract = new web3.eth.Contract(
            VotingContract.abi,
            deployedNetwork.address
          );
          setContract(contract);

          const candidatesCount = await contract.methods.candidatesCount().call();
          let candidatesArray = [];
          for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            candidatesArray.push(candidate);
          }
          setCandidates(candidatesArray);
        }
      }
    };

    loadBlockchainData();
  }, []);

  const vote = async (id) => {
    if (contract) {
      await contract.methods.vote(id).send({ from: account });
      alert("Vote cast successfully!");
      window.location.reload();
    }
  };

  return (
    <div>
      <h1>Blockchain Voting System</h1>
      <p>Connected Account: {account}</p>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - {candidate.voteCount} votes
            <button onClick={() => vote(candidate.id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voting;
