import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/dashboard.module.css';


export default function Menu (){
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [votes, setVotes] = useState([]);
  const [positions, setPositions] = useState([]);

  // Fetch candidates from the backend
  useEffect(() => {

    fetchPositions();
    fetchVotes();
    fetchCandidates();
    fetchVoters();
  }, []);


    // Fetch candidates from the backend
  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/candidate");
      setCandidates(response.data?.candidates || []);
   
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Fetch voters from the backend
  const fetchVoters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voters");
      if (Array.isArray(response.data.voters)) {
        setVoters(response.data.voters);
      } else {
        console.error("Unexpected API response:", response.data);
        setVoters([]);
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
      setVoters([]);
    }
  };

  // Fetch voters from the backend
  const fetchVotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/votes");
      if (Array.isArray(response.data.votes)) {
        setVotes(response.data.votes);
      } else {
        console.error("Unexpected API response:", response.data);
        setVoters([]);
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
      setVotes([]);
    }
  };

    // Fetch positions from the backend
    const fetchPositions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/positions");
        if (Array.isArray(response.data.positions)) {
          setPositions(response.data.positions);
        } else {
          console.error("Unexpected API response:", response.data);
          setPositions([]);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
      }
    };
    return (
        <>
        
        <div className={styles.container}>
          <h2>Dashboard</h2>
<div className={styles.section}>

<div className={styles.detail}>
            <h2>{positions.length}</h2>
            <p>No. of Positions</p>
      </div>
      <div className={styles.detail}>
        <h2>{candidates.length}</h2>
        <p>No. of Candidates</p>
        </div>
    
</div>

<div className={styles.section}>
    <div className={styles.detail}>
            <h2>{voters.length}</h2>
            <p>No. of Voters</p>
      </div>
      <div className={styles.detail}>
        <h2>{votes.length}</h2>
        <p>Total votes casted</p>
        </div>
       
      </div>

    </div>
      
      
        
        </>
    )
}