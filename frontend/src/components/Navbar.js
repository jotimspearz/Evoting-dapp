import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/elections.module.css';
import { ImCross } from "react-icons/im";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

export default function Elections() {
  const [isOpen, setIsOpen]  = useState(false);
  const [isPosFormVisible, setIsPosFormVisible] = useState(false);
  const [isElectFormVisible, setIsElectFormVisible] = useState(false);
  const [electionName, setElectionName] = useState("");
  const [electionDate, setElectionDate] = useState("");
  const [electionType, setElectionType] = useState("");
  const [positionName, setPositionName] = useState("");
  const [maximumNumber, setMaximumNumber] = useState("");
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState();
   const [message, setMessage] = useState(false);
  
   useEffect(() => {
     fetchElections();
   }, []);
   const fetchElections = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/elections");
      setElections(response.data?.elections || []);
        console.log(response.data.elections)
    } catch (error) {
      console.error("Error fetching elections:", error);
    }finally{
      setLoading(false)
    }
  };
  
  const toggleList =()=>{
    setIsOpen(!isOpen);
  };

  const togglePosForm = ()=>{
    setIsPosFormVisible(!isPosFormVisible);
  }
  const toggleElectForm = ()=>{
    setIsElectFormVisible(!isElectFormVisible);
  }

  const handleAddElection = async (e) => {
    e.preventDefault();
 if (!electionName || !electionDate || !electionType) {
  setMessage('Please fill all fields.');
  return;
}
   try {
    console.log(electionName, electionDate, electionType)
    const response = await axios.post("http://localhost:5000/addElection",{
      electionName,
      electionDate,
      electionType,
   });
      console.log(response);
    setMessage('Election added successfully!');

            // Add new election to the state
    const newElection = {
      id: elections.length + 1,
      names: electionName,
      date: electionDate,
      type: electionType
    };
    setElections([...elections, newElection]);
                // Reset form fields
    setElectionName('');
    setElectionDate('');
    setElectionDate(null);
    setElectionType('');

  } catch (error) {
    setMessage('Error: ' + error.message);
    console.error(error);
  }
}
const handleAddPosition = async (e) => {
  e.preventDefault();
if (!positionName || !maximumNumber) {
setMessage('Please fill all fields.');
return;
}}

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
      <div className={styles.heading} onClick={toggleList}>
        {isOpen ? <FaAngleDown/> : <FaAngleRight/>}
        <span>College Elections</span>
        <span>SOMAC</span>
        </div> 
        <ul style={{display: isOpen ? "block" : "none", padding: "0 10px"}}>
          <li className={styles.header}>
            <span>Position Name</span>
            <span>Number of Candidates</span>
            <span>Maximum Number</span>
            <span>Actions</span>
            </li>
          <li>
           <span>President</span> 
           <span>3</span> 
           <span>5</span>
           <span style={{padding: "0"}}>
            <div className={styles.delete}>
            <button>Delete</button>
            <ImCross />
            </div>
            </span>
           </li>
          <li>
           <span>Secretary</span> 
           <span>2</span> 
           <span>3</span>
           <span style={{padding: "0"}}>
            <div className={styles.delete}>
            <button>Delete</button>
            <ImCross />
            </div>
            </span>
            
          </li>
          <li>
           <span>Treasurer</span> 
           <span>2</span> 
           <span>2</span> 
           <span style={{padding: "0"}}>
            <div className={styles.delete}>
            <button>Delete</button>
            <ImCross />
            </div>
            </span>
          </li>
          <li>
          <div className={styles.addPosition} onClick={togglePosForm}>
            <span className={styles.plusIcon}>+</span>
            <p>Add Position</p>
          </div>
          </li>
          <li>
                          {/* Conditionally render the form if isElectFormVisible is true */}
                          {isPosFormVisible && (
                <div className={styles.popForm}>
                  <form onSubmit={handleAddPosition}>
                  <div className={styles.field}>
                  <label htmlFor="name">Position Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={positionName} 
                    onChange={(e) => setPositionName(e.target.value)} 
                    required 
                  />
                </div>
        
                <div className={styles.field}>
                  <label htmlFor="maximumNumber">Maximum Number</label>
                  <input 
                    type="number" 
                    id="maximumNumber" 
                    value={maximumNumber} 
                    onChange={(e) => setMaximumNumber(e.target.value)} 
                    required 
                  />
                </div>
        
                <div className={styles.field}>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                <button type="button" onClick={togglePosForm} >Close</button>
                
                </div>
        
                  </form>
                 
                  {message && <p>{message}</p>}
                </div>
              )}
          </li>
        </ul>
        {!isElectFormVisible && (
        <div className={styles.addElection} onClick={toggleElectForm}>
          <div className={styles.addContent}>
            <span className={styles.plusIcon}>+</span>
            <p>Add Election</p>
          </div>
        </div>
        )}
              {/* Conditionally render the form if isElectFormVisible is true */}
              {isElectFormVisible && (
                <div className={styles.popForm}>
                  <form onSubmit={handleAddElection}>
                  <div className={styles.field}>
                  <label htmlFor="name">Election Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={electionName} 
                    onChange={(e) => setElectionName(e.target.value)} 
                    required 
                  />
                </div>
        
                <div className={styles.field}>
                  <label htmlFor="date">Election Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    value={electionDate} 
                    onChange={(e) => setElectionDate(e.target.value)} 
                    required 
                  />
                </div>
        
                <div className={styles.field}>
                  <label htmlFor="type">Election Type</label>
                  <input 
                    type="text" 
                    id="type" 
                    value={electionType} 
                    onChange={(e) => setElectionType(e.target.value)} 
                    required 
                  />
                </div>
        
                <div className={styles.field}>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                <button type="button" onClick={toggleElectForm} >Close</button>
                
                </div>
        
                  </form>
                 
                  {message && <p>{message}</p>}
                </div>
              )}
        </div>
    </div>
  );
}
