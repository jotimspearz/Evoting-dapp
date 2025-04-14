import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/elections.module.css';
import { ImCross } from "react-icons/im";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";

export default function Elections() {
  const [openElections, setOpenElections] = useState({});
  const [isPosFormVisible, setIsPosFormVisible] = useState(false);
  const [isElectFormVisible, setIsElectFormVisible] = useState(false);
  const [electionName, setElectionName] = useState("");
  const [electionDate, setElectionDate] = useState("");
  const [electionType, setElectionType] = useState("");
  const [positionName, setPositionName] = useState("");
  const [electionId, setElectionId] = useState("");
  const [maximumNumber, setMaximumNumber] = useState("");
  const [elections, setElections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showIcon, setShowIcon] = useState(null);

  useEffect(() => {
    fetchElections();
    fetchPositions();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/elections");
      console.log(response.data.elections);
      setElections(response.data?.elections || []);
      
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/positions");
      console.log(response);
      setPositions(response.data?.positions || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const toggleList = (electionId) => {
    setElectionId(electionId);
    setOpenElections((prevState) => ({
      ...prevState,
      [electionId]: !prevState[electionId] // Toggle only the clicked election
    }));
  };
  

  const togglePosForm = () => setIsPosFormVisible(!isPosFormVisible);
  const toggleElectForm = () => setIsElectFormVisible(!isElectFormVisible);

  const handleAddElection = async (e) => {
    e.preventDefault();
    if (!electionName || !electionDate || !electionType) {
      setMessage('Please fill all fields.');
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/addElection", {
        electionName,
        electionDate,
        electionType,
      });

      setMessage('Election added successfully!');
      setElections([...elections, response.data.election]); // Use response data

      setElectionName('');
      setElectionDate('');
      setElectionType('');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    
    if (!positionName || !maximumNumber || !electionId) {
      setMessage('Please fill all fields or select an election');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/addPosition", {
        positionName,
        maximumNumber,
        electionId,
      });
      
        const newPosition = response.data.position; 
      setMessage('Position added successfully!');
      setPositions((positions) => [...positions, newPosition]);
     
      fetchPositions();
      setPositionName('');
      setMaximumNumber('');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }finally{
      setLoading(false);
    }
  };
  

  const deletePosition = async (id) => {
    console.log(id)
    if (!window.confirm("Are you sure you want to delete this Position")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/position/${id}`);
      console.log(response)
      setMessage("Position removed successfully");
      fetchPositions();
    } catch (error) {
      console.error("Error deleting position:", error);
    }
  };

  const deleteElection = async (id) => {
    console.log(id)
    if (!window.confirm("Are you sure you want to delete this election?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/election/${id}`);
      console.log(response)
      fetchElections();
    } catch (error) {
      console.error("Error deleting Election:", error);
    }
  };


  return (
    <div className={styles.container}>
      <h2>Elections</h2>
      <div className={styles.content}>
        {elections.length > 0 ? (
          elections.map((election) => (
            <div className={styles.election} key={election.id}>


              <div 
              className={styles.heading} 
             
              onMouseEnter={() => setShowIcon(election.id)}
              onMouseLeave={() => setShowIcon(null)}
              >

                <span onClick={() => toggleList(election.id)} >{openElections[election.id] ? <FaAngleDown /> : <FaAngleRight />}</span>
                
                <span>{election.name}</span>
                <span>{election.type}</span>
                <span>
                {showIcon === election.id && (
                          <a className={styles.deleteElection} onClick={() => deleteElection(election.id)}>
                            <ImCross />
                          </a>
                        )}
                </span>
               

              </div>
              <ul style={{ display: openElections[election.id] ? "block" : "none", padding: "0 10px" }}>
                <li className={styles.header}>
                  <span>Position Name</span>
                  <span style={{width: '250px'}}>Number of Candidates</span>
                  <span>Maximum Number</span>
                  <span>Actions</span>
                </li>
                {loading && <span>Loading....</span>}
                {message && <p>{message}</p>}
                {positions.filter(pos => pos?.electionId && pos.electionId === election.id).length > 0 ? (
  positions
    .filter(pos => pos?.electionId && pos.electionId === election.id)
    .map((position) => (
      <li key={position.id}>
        <span>{position.name}</span>
        <span>2</span>
        <span>{position.maxNumber}</span>
        <span style={{ padding: "0" }}>
          <div className={styles.delete} onClick={() => { deletePosition(position.id) }}>
            <button>Delete</button>
            <ImCross />
          </div>
        </span>
      </li>
    ))
) : (
  <p>No position available</p>
)}

                {!isPosFormVisible && (
                <li>
                  <div className={styles.addPosition} onClick={togglePosForm}>
                    <span className={styles.plusIcon}>+</span>
                    <p>Add Position</p>
                  </div>
                </li>
                )}
                {isPosFormVisible && (
                  <div className={styles.popForm}>
                    <form onSubmit={handleAddPosition}>
                      <div className={styles.field}>
                        <label htmlFor="name">Position Name</label>
                        <input type="text" id="name" value={positionName} onChange={(e) => setPositionName(e.target.value)} required />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="maximumNumber">Maximum Number</label>
                        <input type="number" id="maximumNumber" value={maximumNumber} onChange={(e) => setMaximumNumber(e.target.value)} required />
                      </div>

                      <div className={styles.field}>
                        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                        <button type="button" onClick={togglePosForm}>Close</button>
                      </div>
                    </form>
                    {message && <p>{message}</p>}
                  </div>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No election available</p>
        )}

        {!isElectFormVisible && (
          <div className={styles.addElection} onClick={toggleElectForm}>
            <div className={styles.addContent}>
              <span className={styles.plusIcon}>+</span>
              <p>Add Election</p>
            </div>
          </div>
        )}

        {isElectFormVisible && (
          <div className={styles.popForm}>
            <form onSubmit={handleAddElection}>
              <div className={styles.field}>
                <label htmlFor="name">Election Name</label>
                <input type="text" id="name" value={electionName} onChange={(e) => setElectionName(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="date">Election Date</label>
                <input type="date" id="date" value={electionDate} onChange={(e) => setElectionDate(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="type">Election Type</label>
                <input type="text" id="type" value={electionType} onChange={(e) => setElectionType(e.target.value)} required />
              </div>
              <button type="submit">Submit</button>
              <button type="button" onClick={toggleElectForm}>Close</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
