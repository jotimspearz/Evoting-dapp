import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/voters.module.css";
import { GoSearch } from "react-icons/go";
import { ImCross } from "react-icons/im";

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterEligibility, setFilterEligibility] = useState("");

  useEffect(() => {
    fetchVoters();
  }, []);

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

  const updateVoter = async (regNumber, field, value) => {
    try {
      await axios.put(`http://localhost:5000/voters/${regNumber}`, {
        [field]: value,
      });
      fetchVoters();
    } catch (error) {
      console.error("Error updating voter:", error);
    }
  };

  const deleteVoter = async (regNumber) => {
    if (!window.confirm("Are you sure you want to delete this voter?")) return;
    try {
      await axios.delete(`http://localhost:5000/voters/${regNumber}`);
      fetchVoters();
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  const filteredVoters = voters.filter((voter) =>
    voter.RegNumber.includes(search) &&
    (filterRole ? voter.Role === filterRole : true) &&
    (filterEligibility ? voter.Eligibility.toString() === filterEligibility : true)
  );

  return (
    <div className={styles.container}>
      <h2>Voter Management</h2>
      <div className={styles.votersHeader}>
        <div className={styles.fieldInput}>
          <input
            type="text"
            placeholder="Search by RegNumber"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.votersSearch}
          />
          <span><GoSearch/></span>
        </div>
        <select onChange={(e) => setFilterRole(e.target.value)} className={styles.votersSelect}>
          <option value="">Filter by Role</option>
          <option value="Admin">Admin</option>
          <option value="Voter">Voter</option>
        </select>
        <select onChange={(e) => setFilterEligibility(e.target.value)} className={styles.votersSelect}>
          <option value="">Filter by Eligibility</option>
          <option value="1">Eligible</option>
          <option value="0">Not Eligible</option>
        </select>
      </div>
      <table className={styles.votersTable}>
        <thead>
          <tr>
            <th>Reg Number</th>
            <th>Role</th>
            <th>Eligibility</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVoters.map((voter) => (
            <tr key={voter.RegNumber}>
              <td>{voter.RegNumber}</td>
              <td>
                <select
                  value={voter.Role}
                  onChange={(e) => updateVoter(voter.RegNumber, "Role", e.target.value)}
                  className={styles.votersSelect}
                >
                  <option value="Admin">Admin</option>
                  <option value="Voter">Voter</option>
                </select>
              </td>
              <td>
                <select
                  value={voter.Eligibility}
                  onChange={(e) => updateVoter(voter.RegNumber, "Eligibility", e.target.value)}
                  className={styles.votersSelect}
                >
                  <option value="1">Eligible</option>
                  <option value="0">Not Eligible</option>
                </select>
              </td>
              <td className={styles.votersDelete}>
                <button onClick={() => deleteVoter(voter.RegNumber)}>Delete</button>
                <ImCross />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Voters; 
