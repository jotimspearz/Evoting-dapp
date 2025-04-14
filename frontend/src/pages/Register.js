import React, { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

const Register = ({ accountAddress }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [account, setAccount] = useState('');
    const [registered, setRegistered] = useState(false);
    
       const sendName = async (e) =>{
        
        e.preventDefault()
          try {
            const response = await axios.post('http://localhost:5000/register',{email, password, role, account});
        
            console.log('Server Response:', response.data);
            setRegistered(true);
          } catch (error) {
            console.error('Error sending name:', error);
          }
        };

    return (
      <div>
        <form onSubmit={sendName}>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            /> 
           <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            /> 
               <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
            /> 
               <input
                type="text"
                placeholder="Account"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
            /> 
            <button type="submit">Register</button>
        </form>
        {registered && <p>Registered successfully, return to <Link to ="/login" >Login</Link> </p>}
       
        </div>
    );
};

export default Register;
