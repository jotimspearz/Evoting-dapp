import { useState } from "react";
import styles from '../styles/login.module.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { connectMetaMask } from "./connection";

const Login = () => {
 
  //data from input fields
const [RegNumber, setRegNumber] = useState("")
const [Password, setPassword] = useState("")
const [error, setError] = useState("")
const [success, setSuccess] = useState("")

const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors

  try {
    const result = await connectMetaMask();
    
    if (!result.isConnected) { // Fixing the incorrect assignment
      throw new Error("Connect to MetaMask");
    }

    console.log("Connected account:", result.account);

    const response = await axios.post("http://localhost:5000/login", { 
      RegNumber, 
      Password,
    });

    if (response.status === 200 && response.data.voter) {
      const role = response.data.voter.Role;
        console.log(response.data)
      if (!role) {
        throw new Error("User role is missing. Please contact support.");
      }

      console.log("User role:", role);
      localStorage.setItem("userRole", role);
      
      // Redirect based on role
      navigate(role === "Admin" ? "/adminPage" : "/votersPage");
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
      setError(error.message || "Network error. Please check your connection.");
    }
  }
};



  return (
    <div className={styles.container}>
     
    <div className={styles.signinContainer}>
      <header>Login</header>

      {/* Form Content */}
      <div className={styles.formOuter}>
        <form  onSubmit={handleLogin}>   
          <div className={styles.page}>
            <div className={styles.field}>
            <div className={styles.label}>
                        Registration Number
                     </div>
                     <input type="text" value={RegNumber} onChange={(e)=>{setRegNumber(e.target.value)}} />
                  </div>
                  <div className={styles.field}>
                     <div className={styles.label}>
                        Password
                     </div>
                     <input type="password" value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className={styles.field}>
              <button type="submit" className={`${styles.firstNext} ${styles.next}`} >
                Login
              </button>
            </div>
         
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className={styles.signLink}>
                    <Link to='/register'> <p>Don't have an account? <span className={styles.signupLink} >Register</span></p></Link>   
                    </div>
      </div>
    </div>
    <div className={styles.signinImg}>
                <h2>Welcome back</h2>
                <p>Please Login with your personal information to make your decision count.</p>
            
        </div>
    </div>
  );
};

export default Login;
