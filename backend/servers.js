const bcrypt = require("bcryptjs");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON body
app.use(cors()); // Enable CORS if your frontend is on a different port

// Create Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "Blockchain123!.",
    database: "evoting", 
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});



// Register Route
app.post("/register", async (req, res) => {
    try {
        const { email, password, role, accountAddress } = req.body;
        console.log("Received Request Data:", req.body);

        if (!email || !password || !role || !accountAddress) {
             console.log("Missing fields detected:", { email, password, role, accountAddress});
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (email, password, role, account) VALUES (?, ?, ?, ?)";
        db.query(sql, [email, hashedPassword, role, accountAddress], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Database Insertion Failed", error: err });
            }
            res.status(201).json({ message: "Voter registered successfully" });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
