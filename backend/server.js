import express from 'express'
import bcrypt from 'bcryptjs';  
import cors from 'cors'
import multer from 'multer'
import mysql from 'mysql2'
import path from 'path'
import fs from 'fs'

import {getVotesByVoter, getVotes, createVote, getExistingVote, getPosition, deletePosition, getPositions, addPosition, deleteElection, getElections, addElection, getVoters, createVoter, getVoter, updateVoterEligibility, updateVoterRole, deleteCandidate, createUser, VerifyUser, getCandidate, getCandidates, createCandidate} from './Database.js';

const server = express()

// Set up middleware to parse JSON request bodies
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// Enable CORS for all origins
server.use(cors())


// Create a directory to store uploaded images (if it doesn't exist)
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique file name based on timestamp
  }
});

// Create an upload middleware using Multer
const upload = multer({ storage: storage });


// Route to handle image upload and form data
server.post('/addcandidate', upload.single('image'), async (req, res) => {
  const { name, position_id } = req.body;
  const image = req.file ? req.file.path : null;  // Get uploaded image path

  console.log("Received Data:", { name, position_id, image });

  // Ensure that all required fields are provided
  if (!name || !position_id || !image) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Insert candidate into the database (assuming you update the function to store image)
    const result = await createCandidate(name, position_id, image);
    console.log("Database result:", result);
    res.status(200).json({ 
      success: true,
      message: "Candidate registered successfully", 
      candidate: { name, position_id, image }
  });
  

  } catch (error) {
    console.error("Database Error:", error);

    res.status(500).json({ 
        success: false, 
        error: { message: "Registration failed due to a server error." } 
    });
  }
});


// Serve uploaded images via static endpoint
server.use('/uploads', express.static('uploads'));



server.post("/register", async (req, res) => {
    try {
        const { FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, Password } = req.body;

        console.log("Received Data:", { FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, Password });

        // Check if all fields are provided
        if (!FirstName || !LastName || !DateOfBirth || !Email || !PhoneNumber || !Gender || !RegNumber || !Password) {
            return res.status(400).json({ error: { code: 400, message: "All fields are required" } });
        }

        // ✅ Enforce Age Restriction (User must be at least 18)
        const userAge = new Date().getFullYear() - new Date(DateOfBirth).getFullYear();
        if (userAge < 18) {
            return res.status(400).json({ error: { code: "AGE_RESTRICTION", message: "You must be at least 18 years old to register." } });
        }

        // ✅ Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(Password, 10);

        // ✅ Insert into Database
        const result = await createVoter(FirstName, LastName, DateOfBirth, Email, PhoneNumber, Gender, RegNumber, hashedPassword);
        console.log("Database result:", result);

        return res.status(201).json({ 
            message: "User registered successfully", 
            user: { Email, RegNumber } 
        });

    } catch (error) {
        console.error("Database Error:", error);

        // ✅ Better Error Handling for Duplicate Entries
        if (error.code === "ER_DUP_ENTRY") {
            let message = "A user with these details already exists.";
            if (error.sqlMessage.includes("Email")) {
                message = "An account with this email already exists.";
            } else if (error.sqlMessage.includes("PhoneNumber")) {
                message = "An account with this phone number already exists.";
            } else if (error.sqlMessage.includes("RegNumber")) {
                message = "An account with this registration number already exists.";
            }

            return res.status(400).json({ error: { code: "ER_DUP_ENTRY", message } });
        }

        return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Registration failed due to a server error." } });
    }
});




server.post("/login", async (req, res) => {
  const { RegNumber, Password } = req.body;

  if (!RegNumber || !Password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const voter = await getVoter(RegNumber); // Fetch voter details
   
    if (!voter) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password from the database
    const isMatch = await bcrypt.compare(Password, voter.Password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ 
      message: "Login successful", 
      voter: { RegNumber: voter.RegNumber, PhoneNumber: voter.PhoneNumber, Role:voter.Role}
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login Failed", error: error.message });
  }
});


server.get("/candidate", async (req, res) => {
  try {
    const candidates = await getCandidates();

    return res.status(200).json({ 
      message: "successful", 
      candidates // ✅ Correct structure
    });

  } catch (error) {
    console.error("Error getting candidates:", error);
    return res.status(500).json({ 
      message: "Failed to get candidates", 
      error: error.message 
    });
  }
});

//get voters
server.get("/voters", async (req, res) => {
  try {
    const voters = await getVoters();
    console.log(voters);

    return res.status(200).json({ 
      message: "successful", 
      voters
    });

  } catch (error) {
    console.error("Error getting voters:", error);
    return res.status(500).json({ 
      message: "Failed to get voters", 
      error: error.message 
    });
  }
});


//Update Voter

// ✅ UPDATE VOTER (Role or Eligibility)
server.put("/voters/:RegNumber", async (req, res) => {
  const {RegNumber}  = req.params;
  console.log(RegNumber)
  const { Role, Eligibility } = req.body;

  if (!Role && Eligibility === undefined) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  try {
    // Update Role if provided
    if (Role) {
      console.log(Role)
      console.log(RegNumber)
      const result = await updateVoterRole(RegNumber, Role);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Voter not found" });
      }
    }

    // Update Eligibility if provided
    if (Eligibility !== undefined) {
      const result = await updateVoterEligibility(RegNumber, Eligibility);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Voter not found" });
      }
    }

    res.json({ message: "Voter updated successfully" });
  } catch (error) {
    console.error("Error updating voter:", error);
    res.status(500).json({ error: "An error occurred while updating the voter" });
  }
});


//handle deleting candidate
server.delete("/candidate/:id", async (req, res) => {
  const {id}  = req.params;

  if (!id === undefined) {
    return res.status(400).json({ error: "No fields provided" });
  }
  try {
    const result = await deleteCandidate(id);
    console.log(result)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "candidate not found" });
      }
      res.status(200).json({message: "Candidate Removed successfully"});
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ error: "An error occurred while deleting the candidate" });
  }
      
  });

//handle delete election
  server.delete("/election/:id", async (req, res) => {
    const {id}  = req.params;
  
    if (!id === undefined) {
      return res.status(400).json({ error: "No fields provided" });
    }
    try {
      const result = await deleteElection(id);
      console.log(result)
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "election not found" });
        }
        res.status(200).json({message: "Election Removed successfully"});
    } catch (error) {
      console.error("Error deleting election:", error);
      res.status(500).json({ error: "An error occurred while deleting the election" });
    }
        
    });

//handle Add Election
  server.post("/addElection", async (req, res) => {
    const { electionName, electionDate, electionType } = req.body;
    console.log("Received Date",electionName,electionDate,electionType)
  
    if (!electionName || !electionDate || !electionType) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
        const response = await addElection(electionName, electionDate, electionType);
        res.status(200).json({message: "Success"})
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Failed to Add Election", error: error.message });
    }
  });

//handle get Election
server.get("/elections", async (req, res) => {
  try {
      const elections = await getElections();

      return res.status(200).json({ 
        message: "successful", 
        elections // ✅ Correct structure
      });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Failed to Add Election", error: error.message });
  }
});

//handle Add Position
server.post("/addPosition", async (req, res) => {
  const { positionName, maximumNumber, electionId } = req.body;
  console.log("Received Date",positionName, maximumNumber,electionId)

  if (!positionName || !maximumNumber || !electionId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
      const response = await addPosition(positionName, maximumNumber, electionId);
    
      const position = await getPosition(response.insertId)
      res.status(200).json({message: "Success", position})
  } catch (error) {
    console.error("error adding Position:", error);
    return res.status(500).json({ message: "Failed to Add Position", error: error.message });
  }
});

//handle get Election positions
server.get("/positions", async (req, res) => {
  try {
      const positions = await getPositions();

      return res.status(200).json({ 
        message: "successful", 
        positions // ✅ Correct structure
      });

  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "Failed to get Position", error: error.message });
  }
});

//handle deleting position
server.delete("/position/:id", async (req, res) => {
  const {id}  = req.params;
  console.log("received id", id);
  if (!id === undefined) {
    return res.status(400).json({ error: "No fields provided" });
  }
  try {
    const result = await deletePosition(id);
    console.log(result)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "position not found" });
      }
      res.status(200).json({message: "Position Removed successfully"});
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({ error: "An error occurred while deleting the position" });
  }
      
  });


  //handle voting
  server.post("/vote", async (req, res) => {
    const { voterAddress, candidateId, positionId, electionId } = req.body;
  
    const existingVote = getExistingVote(voterAddress,positionId);
      console.log(existingVote);
    if (existingVote.length > 0) {
      return res.status(400).json({ message: "You have already voted for this position." });
    }
  const results = await createVote(voterAddress, candidateId, positionId, electionId)
  
    res.status(200).json({ message: "Vote submitted successfully!" });
  });
  

//get votes by address
server.get("/votes", async (req, res) => {

  try {
    const votes = await getVotes(); // Write this DB query
    console.log(votes);
    res.status(200).json({ votes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch votes." });
  }
});


//get votes by address
server.get("/votes/:voterAddress", async (req, res) => {
  const { voterAddress } = req.params;

  try {
    const results = await getVotesByVoter(voterAddress); // Write this DB query
    res.status(200).json({ votes: results[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch votes." });
  }
});


server.listen(5000, () => console.log("Server running on port 5000"));
