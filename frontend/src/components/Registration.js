import { useState } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import { connectMetaMask } from "./connection";
import styles from "../styles/registration.module.css";


const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    console.log(step)
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    console.log(step)
  };


//data from input fields
const [FirstName, setFirstName] = useState("")
const [LastName, setLastName] = useState("")
const [DateOfBirth, setDateOfBirth] = useState("")
const [Email, setEmail] = useState("")
const [PhoneNumber, setPhoneNumber] = useState("")
const [Gender, setGender] = useState("Male")
const [RegNumber, setRegNumber] = useState("")
const [Password, setPassword] = useState("")
const [error, setError] = useState("")
const [message, setMessage] = useState("")


const handleRegisteration = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors
  setMessage(""); // Clear previous  messages

  try {
      // ✅ 1. Connect to MetaMask
      const result = await connectMetaMask();
      if (!result.isConnected) {  // ✅ FIXED the check
          throw new Error("Please connect to MetaMask.");
      }
      console.log("Connected account:", result.account);

      // ✅ 2. Send registration data
      const response = await axios.post("http://localhost:5000/register", {
          FirstName,
          LastName,
          DateOfBirth,
          Email,
          PhoneNumber,
          Gender,
          RegNumber,
          Password,  // Password will be hashed on the backend
          // account: result.account, (Optional, if needed)
      });

      console.log("Response:", response);
      setMessage("User registered successfully!"); // ✅ Show success message

  } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
          const errCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
          
          switch (errCode) {
              case "ER_DUP_ENTRY":
                  setError("An account with these credentials already exists.");
                  break;
              case "AGE_RESTRICTION":
                  setError("You must be at least 18 years old to register.");
                  break;
              case 400:
                  setError("Invalid input. Ensure all fields are filled correctly.");
                  break;
              case 500:
                  setError("Server error. Please try again later.");
                  break;
              default:
                  setError(error.response?.data?.error?.message || "An unknown error occurred.");
          }
      } else {
          setError("Network error. Please check your internet connection.");
      }
  }
};

  


  return (
    <div className={styles.container}>
        <div className={styles.signupImg}>
                <h2>Create Account</h2>
                <p>To become a part of the decision makers, please sign up using your personal information.</p>
            
        </div>
    <div className={styles.regContainer}>
      <header>Registration</header>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className={styles.step}>
            <p className={step >= num ? styles.active : ""}>Step {num}</p>
            <div className={`${styles.bullet} ${step >= num ? styles.active : ""}`}>
              <span>{num}</span>
            </div>
            <div className={`${styles.check} ${step > num ? styles.active : ""}`}>&#10003;</div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className={styles.formOuter}>
        <form style={{ marginLeft: `${-(step - 1) * 100}%` }} onSubmit={handleRegisteration}>
          {/* Step 1 */}
          
          <div className={styles.page}>
            <div className={styles.title}>Personal Info</div>
            <div className={styles.field}>
            <div className={styles.label}>
                        First Name
                     </div>
                     <input type="text" value={FirstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
                  </div>
                  <div className={styles.field}>
                     <div className={styles.label}>
                        Last Name
                     </div>
                     <input type="text" value={LastName} onChange={(e)=>{setLastName(e.target.value)}}/>
                     
            </div>
            <div className={styles.field}>
            <div className={styles.label}>
                        Date of Birth
                     </div>
                     <input type="date" value={DateOfBirth} onChange={(e)=>{setDateOfBirth(e.target.value)}}/>

                  </div>
            <div className={styles.field}>
              <button type="button" className={`${styles.nextStep} ${styles.next}`} onClick={nextStep}>
                Next
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.page}>
            <div className={styles.title}>Contact Info</div>
            <div className={styles.field}>
            <div className={styles.label}>
                        Email
                     </div>
                     <input type="email" value={Email} onChange={(e)=>{setEmail(e.target.value)}}/>

                  </div>
                  <div className={styles.field}>
                     <div className={styles.label}>
                        Phone Number
                     </div>
                     <input type="text" value={PhoneNumber} onChange={(e)=>{setPhoneNumber(e.target.value)}}/>

            </div>
            <div className={styles.field}>
                     <div className={styles.label}>
                        Gender
                     </div>
                     <select value={Gender} onChange={(e)=>{setGender(e.target.value)}}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                     </select>
            </div>
            <div className={styles.btns}>
              <button type="button" className={styles.prev} onClick={prevStep}>
                Previous
              </button>
              <button type="button" className={styles.next} onClick={nextStep}>
                Next
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.page}>
            <div className={styles.title}>Login Details:</div>
            <div className={styles.field}>
            <div className={styles.label}>
                        Registration Number
                     </div>
                     <input type="text" value={RegNumber} onChange={(e)=>{setRegNumber(e.target.value)}}/>

                  </div>
                  <div className={styles.field}>
                     <div className={styles.label}>
                        Password
                     </div>
                     <input type="password" value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
                     
            </div>
            <div className={styles.btns}>
              <button type="button" className={styles.prev} onClick={prevStep}>
                Previous
              </button>
              <button type="button" className={styles.next} onClick={nextStep}>
                Next
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className={styles.page}>
            <div className={styles.confirm}>
              <span className={styles.title}>Confirmation</span>
              <p style={{padding: '30px 0'}}>You're all set!</p>
              </div>
            
            <div className={styles.btns}>
              <button type="button" className={`${styles.prev} ${styles.secondary}`} onClick={prevStep}>
                Previous
              </button>
              <button type="submit" className={styles.next}>Submit</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

          </div>
         <div className={styles.field}>
        
         </div>
         
        </form>
        
        <div className={styles.signLink}>
                    <Link to='/login'> <p>Already have an account? <span>Login</span></p></Link>   
                    </div>
      </div>
    </div>
    </div>
  );
};

export default Registration;
