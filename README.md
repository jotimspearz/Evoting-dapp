# Evoting-dapp
# 🗳️ Decentralized E-Voting System

A blockchain-powered electronic voting system built with React, Truffle, Web3.js, and MySQL. This platform ensures secure, transparent, and tamper-proof elections by combining the power of smart contracts with traditional web technologies.

## 🚀 Features

- 🔐 Secure voter registration
- 🧾 Smart contract-powered vote casting
- 🧠 One-vote-per-user enforcement
- 📊 Dynamic election and candidate management
- 🧮 Real-time vote counting via the blockchain
- 💽 Voter info (age, gender, district) stored in MySQL
- 🔗 MetaMask integration for authentication

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Web3.js
- MetaMask

### Smart Contracts
- Solidity
- Truffle Framework

### Backend
- Node.js / Express.js
- MySQL

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/YOUR-USERNAME/evoting-dapp.git
cd evoting-dapp
2. Install Dependencies
Backend (if in server/ folder)
bash
Copy
Edit
cd server
npm install
Frontend (if in client/ folder)
bash
Copy
Edit
cd client
npm install
Smart Contracts
bash
Copy
Edit
cd contracts
npm install
truffle compile

🧪 Running the App Locally
1. Start the Blockchain (Ganache)
Make sure Ganache is running locally at http://127.0.0.1:7545.

2. Deploy Smart Contracts
bash
Copy
Edit
cd contracts
truffle migrate --reset
3. Start Backend API Server
bash
Copy
Edit
cd server
npm start
4. Start React Frontend
bash
Copy
Edit
cd client
npm start
Open the frontend at: http://localhost:3000

📸 Screenshots
Add screenshots here to show UI (optional)

📦 Database Schema (MySQL)
Make sure you have a the following tables with fields like:
## voters table
id                      
name
age
gender
district
wallet_address

##election table
election_id
election_name
election_date
election_type

##positions table
position_id
position_name
election_id
Number_of_candidates

##candidates table
id
names
position_id
imageUrl

## votes table
vote_id
election_id
candidate_id
voter_id
voter_time


📄 License
MIT License
