import { useState, useEffect, use } from "react";
  import axios from "axios";
import styles from '../styles/candidates.module.css';
import { ImCross } from "react-icons/im";
import { connectMetaMask } from "./connection";
import { motion, AnimatePresence } from "framer-motion";
export default function CandidateProfiles() {

  const [candidates, setCandidates] = useState([]);
  const [candidateNames, setCandidateNames] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [candidatePositionId, setCandidatePositionId] = useState('');
  const [candidateImage, setCandidateImage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState();
  const [positions, setPositions] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [elections, setElections] = useState([]);
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [votedPositions, setVotedPositions] = useState([]);

  // Fetch candidates from the backend
useEffect(() => {
  fetchCandidates();
  fetchPositions();
  fetchElections();
  fetchUserVotes();
}, []);


useEffect(() => {
  console.log("votedPositions updated:", votedPositions);
}, [votedPositions]);




const fetchCandidates = async () => {
  setLoading(true)
  try {
    const response = await axios.get("http://localhost:5000/candidate");
    setCandidates(response.data?.candidates || []);
   
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }finally{
    setLoading(false)
  }
};

//fetch votes
const fetchUserVotes = async () => {
  const { account } = await connectMetaMask();

  try {
    const response = await axios.get(`http://localhost:5000/votes/${account}`);
    console.log(response.data.votes)
    const votes = response.data.votes || [];
    // Get an array of positionIds the user has already voted for
    const positionIds = votes.map(vote => vote.positionId);
    setVotedPositions(positionIds);
    console.log(positionIds);
  } catch (error) {
    console.error("Error fetching user votes:", error);
  }
};


  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCandidateImage(file);
    }
  };

const toggleForm = (id)=>{
  setSelectedElectionId(id);
  setIsFormVisible(!isFormVisible);
}

const handleAddCandidate = async (e) => {
  e.preventDefault();

  if (!candidateNames || !candidatePositionId || !candidateImage) {
    setMessage('Please fill all fields.');
    return;
  }

  const formData = new FormData();
  formData.append("name", candidateNames);
  formData.append("position_id", candidatePositionId);
  formData.append("image", candidateImage);

  const position = positions.find(pos => pos.id === parseInt(candidatePositionId));
  const electionId = position?.electionId;
  try {
    const response = await axios.post("http://localhost:5000/addCandidate", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  
    // Set success message for this election
        // Set success message for this election
        setMessages(prev => ({ ...prev, [electionId]: 'Candidate Added successfully!' }));
        setTimeout(() => {
        setMessages(prev => ({ ...prev, [electionId]: '' }));
        }, 4000);
    
       setErrors(prev => ({ ...prev, [electionId]: '' }));
    fetchCandidates();

    // Reset
    setCandidateNames('');
    setCandidatePosition('');
    setCandidatePositionId('');
    setCandidateImage(null);
    setIsFormVisible(false);
  } catch (error) {
    setErrors(prev => ({ ...prev, [electionId]: 'Error adding Candidate' }));
    setTimeout(() => {
      setErrors(prev => ({ ...prev, [electionId]: '' }));
      }, 4000);
    setMessages(prev => ({ ...prev, [electionId]: '' }));
    console.error("Error casting vote:", error);
    console.error(error);
  }
};



  const deleteCandidate = async (id) => {
    console.log(id)
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/candidate/${id}`);
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

//variables that handle user interfaces
const [showIcon, setShowIcon] = useState(null);
const [flippedId, setFlippedId] = useState()


const fetchPositions = async () => {
  try {
    const response = await axios.get("http://localhost:5000/positions");
    
    setPositions(response.data?.positions || []);
  } catch (error) {
    console.error("Error fetching positions:", error);
  }
};

const fetchElections = async () => {
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:5000/elections");
   
    setElections(response.data?.elections || []);
    
  } catch (error) {
    console.error("Error fetching elections:", error);
  } finally {
    setLoading(false);
  }
};


//casting vote
const handleVote = async (candidateId, positionId) => {

  const position = positions.find(pos => pos.id === parseInt(positionId));
  const electionId = position?.electionId;

  const voterAddress = (await connectMetaMask()).account;

  if (!electionId) {
    alert("Could not determine election.");
    return; 
  }

  // Send vote to backend
  try {
    const response = await axios.post("http://localhost:5000/vote", {
      voterAddress, // from MetaMask
      candidateId,
      positionId,
      electionId,
    })
       // Set success message for this election
       setMessages(prev => ({ ...prev, [electionId]: 'Vote cast successfully!' }));
        setTimeout(() => {
        setMessages(prev => ({ ...prev, [electionId]: '' }));
        }, 4000);
    
       setErrors(prev => ({ ...prev, [electionId]: '' }));
     
       // ✅ Update the state so the button gets disabled immediately
       setVotedPositions(prev => [...prev, Number(positionId)]);
  } catch (error) {
    setErrors(prev => ({ ...prev, [electionId]: 'Error casting vote' }));
    setTimeout(() => {
      setErrors(prev => ({ ...prev, [electionId]: '' }));
      }, 4000);
    setMessages(prev => ({ ...prev, [electionId]: '' }));
    console.error("Error casting vote:", error);
  }
};




  return (
    <div className={styles.container}>

      <h2>Candidates</h2>
      {elections.length > 0 ? (
                elections.map((election) => (
                  <div  key={election.id}>
                    <h3 className={styles.electionTitle}>{election.name} {election.type}</h3>
                    {messages[election.id] && (
  <p style={{ color: 'green' }}>{messages[election.id]}</p>
)}
{errors[election.id] && (
  <p style={{ color: 'red' }}>{errors[election.id]}</p>
)}

    <section className={styles.candidates}>

          {candidates.filter(candidate => 
  positions
    .filter(pos => pos.electionId === election.id)
    .map(pos => pos.id)
    .includes(Number(candidate.position_id))
).length > 0 ? (
  candidates
    .filter(candidate => 
      positions
        .filter(pos => pos.electionId === election.id)
        .map(pos => pos.id)
        .includes(Number(candidate.position_id))
    )
    .map(candidate => (
      
    <div className={`${styles.card} ${(flippedId === candidate.id) ? styles.flipped : ""}`}>
<div
        className={styles.candidateCard}
        key={candidate.id}
     
        onMouseEnter={() => setShowIcon(candidate.id)}
        onMouseLeave={() => setShowIcon(null)}
      >
        {showIcon === candidate.id && (
          <a className={styles.close} onClick={() => deleteCandidate(candidate.id)}>
            <ImCross />
          </a>
        )}
        <img
          className={styles.candidatePic}
          src={candidate.imageUrl.startsWith("http") ? candidate.imageUrl : `http://localhost:5000/${candidate.imageUrl}`}
          alt="Candidate"
        />
        <h2 className={styles.name}>{candidate.names}</h2>
        {positions.find(pos => pos.id === parseInt(candidate.position_id))?.name || "Unknown"}

        <div className={styles.button}>
          <button className={styles.description} onClick={() => setFlippedId(candidate.id)} >Details</button>
          <button 
  className={styles.vote} 
  onClick={() => handleVote(candidate.id, candidate.position_id)}
  disabled={votedPositions.includes(Number(candidate.position_id))}
>
  {votedPositions.includes(Number(candidate.position_id)) ? "Voted" : "Vote"}
</button>
          </div>
         


      </div>
        {/* BACK SIDE */}
  <div className={styles.cardBack}>
  <h2 className={styles.name}>About {candidate.names}</h2>
  <p>{candidate.description || "No additional info provided."}</p>
  <div className={styles.button}>
          <button className={styles.description} onClick={() => setFlippedId(null)}>Back</button>
          <button 
  className={styles.vote} 
  onClick={() => handleVote(candidate.id, candidate.position_id)}
  disabled={votedPositions.includes(Number(candidate.position_id))}
>
  {votedPositions.includes(Number(candidate.position_id)) ? "Voted" : "Vote"}
</button>
          </div>
</div>
</div>
    ))
) : (
  <p>No candidates available</p>
)}






{/* Empty Card for Adding a New Candidate */}
{!isFormVisible && (
<div className={`${styles.candidateCard} ${styles.addCard}`} onClick={() => toggleForm(election.id)}>
  <div className={styles.addContent}>
    <span className={styles.plusIcon}>+</span>
    <p>Add Candidate</p>
  </div>
</div>
)}
      {/* Conditionally render the form if isFormVisible is true */}
      <AnimatePresence>

      {isFormVisible && selectedElectionId === election.id && (
               <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
             >
  <div className={styles.popForm}>
    <form onSubmit={handleAddCandidate}>

      {/* Candidate Name Field */}
      <div className={styles.field}>
        <label htmlFor="name">Names:</label>
        <input 
          type="text" 
          id="name" 
          value={candidateNames} 
          onChange={(e) => setCandidateNames(e.target.value)} 
          required 
        />
      </div>

      {/* Position Dropdown */}
      <div className={styles.field}>
        <label htmlFor="position">Position</label>

        <select 
          id="position" 
          value={candidatePositionId}
          onChange={(e) => setCandidatePositionId(e.target.value)}
          required
        >
          <option value="">Select Position</option>
          {positions
  .filter((pos) => pos.electionId === selectedElectionId)
  .map((position) => (
    <option key={position.id} value={position.id}>
      {position.name}
    </option>
  ))}


        </select>
      </div>

      {/* Image Upload */}
      <div className={styles.field}>
        <label htmlFor="image">Image:</label>
        <input 
          type="file" 
          id="image" 
          onChange={handleImageChange} 
          required 
        />
      </div>

      {/* Buttons */}
      <div className={styles.field}>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={toggleForm}>Close</button>
      </div>

    </form>

    {error && <p style={{ color: 'red' }}>{error}</p>}
    {message && <p style={{ color: 'green' }}>{message}</p>}
  </div>
  </motion.div>
)}
</AnimatePresence>
{error && <p style={{ color: 'red' }}>{error}</p>}
{message && <p style={{ color: 'green' }}>{message}</p>}
    </section>
    </div>
  ))
) : (
  <p>No Election Available</p>
)}
    </div>
  );
}
