
import styles from '../styles/login.module.css';

import { useEffect, useState } from 'react';
import axios from "axios";
import { Link , useNavigate} from 'react-router-dom';
import ConnectWallet from '../components/ConnectWallet';
import { connectMetaMask } from './connection';

const AuthComponent = ()=>{

    const navigate = useNavigate();
const [isShown, setIsShown] = useState(false);
const [isActive, setIsActive] = useState(false);
const [showBg, setShowBg] = useState(false);

const handleClick =()=>{
    setIsShown((prev)=> !prev);
    setShowBg((prev)=> !prev);
    
}

const handleBtnClick =()=>{
    setIsActive((prev)=> !prev);
};


//handle login form data
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")
const [role, setRole] = useState("voter")
const [error, setError] = useState("")
const [success, setSuccess] = useState("")

//handle Submit

const handleRegister = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors
  setSuccess(""); // Clear previous success messages

  if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
  }

  try {
      // Connect to MetaMask
      const result = await connectMetaMask();
      if (result.isConnected=false) {
        throw new Error("Connect to MetaMask");
        
      }
      console.log("Connected account:", result.account);
      // Send registration data
      const response = await axios.post("http://localhost:5000/register", {
          email,
          password,
          role,
          account: result.account,
      });

      console.log("Response:", response);
      setSuccess("User registered successfully!"); // Show success message
  } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
          // Handle different status codes safely
          const errCode = error.response?.data?.error?.code;

          switch (errCode) {
              case "ER_DUP_ENTRY":
                  setError("An account with these credentials already exists.");
                  break;
              case 400:
                  setError("Invalid credentials. Make sure you are connected to MetaMask.");
                  break;
              case 500:
                  setError("Server error. Please try again later.");
                  break;
              default:
                  setError("An unknown error occurred.");
          }
      } else {
          setError("Network error. Check your connection.");
      }
  }
};





  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); //clear previous errors
     
    try {
      const result = await connectMetaMask();
      if (result.isConnected=false) {
        throw new Error("Connect to MetaMask");
        
      }
      console.log("Connected account:", result.account);
        const response = await axios.post("http://localhost:5000/login", { 
          email, 
          password,
        account:result.account
      });
  
        if (response.status === 200 && response.data.user) {
          const { role } = response.data.user;
          localStorage.setItem("userRole", role);
  
          // Redirect based on role
          navigate(role === "admin" ? "/adminPage" : "/votersPage");
        }
      } catch (error) {
        if (error.response) {
          // Handle different status codes
          switch (error.response.status) {
            case 400:
              setError("All fields are required.");
              break;
            case 401:
              setError("Invalid credentials. Please try again.");
              break;
            case 500:
              setError("Server error. Please try again later.");
              break;
            default:
              setError("An unknown error occurred.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      }
    };
    return(
        <>
        <ConnectWallet/>
       <button className={`toggle-login ${isActive ? "active" : ""}`} onClick={handleBtnClick}>Login</button>
        <div className={`wrapper ${isShown ? "show-sign" : ""} ${isActive ? "active" : ""}`}>
              {/* Background Spans */}
              <div className="bg"></div>
      {[10,9,8,7,6, 5, 4, 3, 2, 1].map((i) => (
        <span key={i} style={{ "--i": i }}></span>
        
      ))}
            <div className="form-wrapper sign-in">
                <a className="close" onClick={handleBtnClick}><i className="fa-solid fa-xmark"></i></a>
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="input-group">
                    <input
                    type="email"
                    name ="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /> 
                        <label htmlFor="">Email</label>
                    </div>
                    <div className="input-group">
                    <input
                    type="password"
                    name ="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /> 
                        <label htmlFor="">Password</label>
                    </div>
                    <div className="remember">
                        <label htmlFor=""><input type="checkbox" name="" id="" />Remember me</label>
                        <label htmlFor="">Forgot Password</label>
                    </div>
                    <button className="btn" type="submit">Login</button>
                    <div className="sign-link">
                        <p>Don't have an account? <a className='signup-link' onClick={handleClick}>Register</a></p>
                    </div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </form>
            </div>
            <div className="form-wrapper sign-up">
            <form onSubmit={handleRegister}>
    <h2>Register</h2>

    <div className="input-group">
        <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <label>Email</label>
    </div>

    <div className="input-group">
        <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <label>Password</label>
    </div>

    <div className="input-group">
        <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />
        <label>Confirm Password</label>
    </div>

    <div className="input-group">
        <label>Role</label>
        <select name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
        </select>
    </div>

    <button className="btn" type="submit">Submit</button>

    <div className="sign-link">
        <p>Already have an account? <a className='signup-link' href="#" onClick={handleClick}>Login</a></p>
    </div>

    {error && <p style={{ color: 'red' }}>{error}</p>}
    {success && <p style={{ color: 'green' }}>{success}</p>}
</form>

            </div>

        </div>
        </>


   
    )
}

export default AuthComponent;