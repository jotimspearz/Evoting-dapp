import '../styles/styles.module.css';
import {Link} from 'react-router-dom';

const Settings = () => {


  return (
    <div className="results-container">
      <h2>Settings</h2>

      <div className="info-box">
     
     <div className="details">
         <div className="image-box">
         <img src="/Sample2.png" alt="" className='image'/>
          </div>      

     </div>
   </div>
      
      <div className="settings">
       
      <div className="info-box">
     
        <div className="details">
            <div>
            <label htmlFor="">Name</label>
        <input type="text" value='Otim Joseph' readOnly/>
        <label htmlFor="">Email</label>
        <input type="email" value='josephotim70@gmail.com' readOnly/>

            </div>
        <div>
        <label htmlFor="">Gender</label>
        <input type="text" value='Male' readOnly />
        <label htmlFor="">NIN</label>
        <input type="text" value='XXXXCCC' readOnly />
        </div>
        <div>
        <label htmlFor="">Password</label>
        <input type="password" value='jotim' readOnly />
        <label htmlFor="">Phone</label>
        <input type="text" value='0778843611' readOnly />
        </div>

        <div className="btn-box">
          <button className='primary'>Edit</button>
          <button className='secondary'>Save Changes</button>
          </div>

        </div>
      </div>
          
      </div>

      </div>
  );
};

export default Settings;
