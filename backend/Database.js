import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password:process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE, 
}).promise()

pool.getConnection()
    .then(connection => {
        console.log("Connected to MySQL");
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error("Error connecting to MySQL:", err);
    });


export async function getVoters() {
    try {
        const [rows] = await pool.query("SELECT RegNumber, Role, Eligibility FROM Voters");
      return rows;
    } catch (error) {
      console.error("Error fetching voters", error);
      throw error; // Rethrow error to be handled in the calling function
    }
  }


export async function getVoter(RegNumber){
    try {
        const [rows] = await pool.query(`SELECT * 
            FROM Voters 
            WHERE RegNumber = ?
            `,[RegNumber]);
            return rows[0]
    } catch (error) {
        console.error("Error fetching voter", error);
        throw error; // Rethrow error to be handled in the calling function
    }
    
}



export async function createVoter(FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, password) {
   
   try {
    const [result] = await pool.query(`
        INSERT INTO Voters (FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, password]);

    return getVoter(RegNumber);
   } catch (error) {
    console.error("Error creating voter", error);
        throw error;
   }
 
}


// Update Voter Role
export async function updateVoterRole(RegNumber, Role) {
    try {
      const [results] = await pool.query(
        `UPDATE Voters 
        SET Role = ? 
        WHERE RegNumber = ?`,
        [Role, RegNumber]
      );
      return results;
    } catch (error) {
      console.error("Error updating voter role:", error);
      throw error; // Rethrow error to be handled in the calling function
    }
  }
  
  // Update Voter Eligibility
  export async function updateVoterEligibility(RegNumber, Eligibility) {
    try {
      const [results] = await pool.query(
        `UPDATE Voters 
        SET Eligibility = ? 
        WHERE RegNumber = ?`,
        [Eligibility, RegNumber]
      );
      return results;
    } catch (error) {
      console.error("Error updating voter eligibility:", error);
      throw error; // Rethrow error to be handled in the calling function
    }
  }
  

export async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users");
    return rows
}

export async function getUser(id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM users
        WHERE id = ?
        `,[id]);
    return rows[0]
}

export async function getCandidates(){
    const [rows] = await pool.query("SELECT * FROM candidates");
    return rows
}


export async function getCandidate(id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM candidates
        WHERE id = ?
        `,[id]);
    return rows[0]
}
export async function createUser(email, password, role, account) {
    const [result] = await pool.query(`
        INSERT INTO users (email, password, role, account)
        VALUES (?, ?, ?, ?)
    `, [email, password, role, account]);

    const id = result.insertId;
    return getUser(id);
}

export async function VerifyUser(email, password){
    const [rows] = await pool.query(`SELECT * 
        FROM users 
        WHERE email = ? AND password = ?
        `,[email, password]);
        return rows[0]
}

export async function createCandidate (name, position, image){
    const [result] = await pool.query(`
        INSERT INTO candidates (names, position_id, imageUrl)
        VALUES (?, ?, ?)
    `, [name, position, image]);

    const id = result.insertId;
    return getCandidate(id);
};


export async function deleteCandidate (id){

    try {
        const [result] = await pool.query(`
            DELETE FROM candidates
            WHERE id = ?
        `, [id]);
        return result;
    } catch (error) {
        console.error("Error deleting candidate:", error);
      throw error; // Rethrow error to be handled in the calling function
    }

};



export async function deleteElection (id){

  try {
      const [result] = await pool.query(`
          DELETE FROM elections
          WHERE election_id = ?
      `, [id]);
      return result;
  } catch (error) {
      console.error("Error deleting election:", error);
    throw error; // Rethrow error to be handled in the calling function
  }

};

export async function addElection (electionName, electionDate, electionType){
    try {
      const [results] = await pool.query(
        `INSERT INTO elections (election_name, election_date, election_type)
        VALUES(?,?,?)`, [electionName, electionDate, electionType]);
        return results;
    } catch (error) {
      console.error("Errr adding election", error);
      throw error;
    }

}

export async function getElections(){
  try {
    const [rows] = await pool.query(`
      SELECT election_id As id, election_name As name, election_type As type From elections`);
      return rows;
  } catch (error) {
    console.error("failed to fetch elections", error);
    throw error;
  }
}

export async function addPosition (positionName, maximumNumber, electionId){
  try {
    const [results] = await pool.query(
      `INSERT INTO positions (position_name, number_of_candidates, election_id)
      VALUES(?,?,?)`, [positionName, maximumNumber, electionId]);
      return results;
  } catch (error) {
    console.error("Errr adding election", error);
    throw error;
  }

}

export async function getPositions(){
  try {
    const [rows] = await pool.query(`
      SELECT position_id As id, position_name As name, number_of_candidates As maxNumber, election_id As electionId from positions`);
      return rows;
  } catch (error) {
    console.error("failed to fetch positions", error);
    throw error;
  }
}

export async function deletePosition (id){

  try {
      const [result] = await pool.query(`
          DELETE FROM positions
          WHERE position_id = ?
      `, [id]);
      return result;
  } catch (error) {
      console.error("Error deleting position:", error);
    throw error; // Rethrow error to be handled in the calling function
  }

};

export async function getPosition (id){

  try {
      const [position] = await pool.query(`
          SELECT * FROM positions
          WHERE position_id = ?
      `, [id]);
      return position;
  } catch (error) {
      console.error("Error deleting position:", error);
    throw error; // Rethrow error to be handled in the calling function
  }

};
export async function getExistingVote(voterAddress, positionId){
  try {
      const [existingVote] = await pool.query(
        `SELECT * FROM votes 
        WHERE voter_address = ? AND position_id = ?
        `,
        [voterAddress, positionId])
        return existingVote;
      } catch (error) {
          console.error("Error getting vote:", error);
        throw error; // Rethrow error to be handled in the calling function
      }
}

export async function createVote(voterAddress, candidateId, positionId, electionId){

  try {
    const result = await pool.query(
      `INSERT INTO votes (voter_address, candidate_id, position_id, election_id) 
      VALUES (?, ?, ?, ?)`
      , [voterAddress, candidateId, positionId, electionId]);
      return result
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error; // Rethrow error to be handled in the calling function
  }
}

export async function getVotesByVoter(voterAddress) {
  try {
    const result = await pool.query(
      `SELECT position_id As positionId FROM votes
      WHERE  voter_address = ?`
      , [voterAddress]);
      return result
  } catch (error) {
    console.error("Error getting vote:", error);
    throw error; // Rethrow error to be handled in the calling function
  }

}

export async function getVotes() {
  try {
    const votes = await pool.query(
      `SELECT * FROM votes`);
      return votes[0]
  } catch (error) {
    console.error("Error getting votes:", error);
    throw error; // Rethrow error to be handled in the calling function
  }

}
