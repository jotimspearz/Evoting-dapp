
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthComponent from "../components/AuthComponent";
import ConnectWallet from "../components/ConnectWallet";

const HomePage =()=>{
  const [accountAddress, setAccountAddress] = useState('');

  return (
    <div>
   
        <ConnectWallet/>
        <AuthComponent/>
        <Navbar />
    </div>
  );

}
  
export default HomePage;
