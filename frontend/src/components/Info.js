
import '../styles/styles.module.css';
import {Link} from 'react-router-dom';

const Info = () => {


  return (
    <div className="results-container">
      <h2>Information</h2>
      <div className="section">
      <div className="turnout-box">
     
        <div className="details">
        <h3>Voting Information</h3>
        <table>
          <tr>
            <td><b>Voting Status </b></td>
            <td>Not Voted</td>
          </tr>
          <tr>
            <td><b>Eligibility </b></td>
            <td>Not Eligible</td>
          </tr>
        </table>
        </div>
      </div>

      <div className="turnout-box">
     
        <div className="details">
        <h3>Registration Information</h3>
        <table>
          <tr>
            <td><b>Role</b></td>
            <td>None</td>
          </tr>
          <tr>
            <td><b>Registration Status </b></td>
            <td>Not registered </td>
          </tr>
        </table>
        </div>
      </div>
      </div>
      <h3>Personal Information</h3>
      <div className="section">
       
      <div className="info-box">
     
        <div className="details">
            <div>
            <label htmlFor="">Name</label>
        <input type="text" value='Otim Joseph' readOnly/>
        <label htmlFor="">Age</label>
        <input type="number" value='35' readOnly/>

            </div>
        <div>
        <label htmlFor="">Gender</label>
        <input type="text" value='Male' readOnly />
        <label htmlFor="">NIN</label>
        <input type="text" value='XXXXCCC' readOnly />
        </div>
        <div>
        <label htmlFor="">Email</label>
        <input type="text" value='josephotim70@gmail.com' readOnly />
        <label htmlFor="">Phone</label>
        <input type="text" value='0778843611' readOnly />
        </div>
      
        </div>
      </div>

      <div className="turnout-box">
     
        <div className="details">
          <p>Register inorder to be Eligible to vote</p>
          <Link to='/register'> <button className='secondary'>Register</button></Link>
        </div>
      </div>
          
      </div>
   

   <div className="section">

 
      <div className="candidates-details-box">
        <table>
          <tr>
            <th>Candidate Name</th>
            <th>Gender</th>
            <th>Party</th>
            <th>Elected</th>
            <th>% of Votes</th>
          </tr>
          <tr>
            <td >
              <tr>
              <td className='name'><img src="/Sample2.png" alt="prof" className='prof-img'/></td>
              <td className='name'>Otim Joseph</td>
              </tr>
              </td>
            <td>Male</td>
            <td>Independent</td>
            <td><input type="checkbox" name="" id=""/></td>
            <td>46%</td>
          </tr>
        </table>
      </div>
      </div>

    </div>
  );
};

export default Info;
