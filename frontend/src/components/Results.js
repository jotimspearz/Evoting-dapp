import '../styles/styles.module.css';


const Results = () => {


  return (
    <div className="results-container">
      <h2>Election Results</h2>
      <div className="section">
      <div className="turnout-box">
      <div className="circle one">
        
        <div className="inner ">60%</div>
        </div>
     
        <div className="details">
        <h3>Voter Turnout</h3>
        <table>
          <tr>
            <td>
            <span className='dot grey'></span>
            </td>
            <td>Registered Voters</td>
            <td>15,000</td>
          </tr>
          <tr>
            <td>
            <span className='dot red'></span>
            </td>
            <td>Total Ballots Cast</td>
            <td>10,000</td>
          </tr>
          <tr>
          <td></td>
            <td><b>Voter Turnout</b></td>
            <td><b>60%</b></td>
          </tr>
        </table>
        </div>
      </div>

      <div className="turnout-box">
      <div className="circle two">
        <div className="inner">04%</div>
      </div>
     
        <div className="details">
        <h3>Ballots Cast</h3>
        <table>
          <tr>
            <td>
            <span className='dot grey'></span>
            </td>
            <td>Valid Votes</td>
            <td>96%</td>
            <td>190,000</td>
          </tr>
          <tr>
            <td>
            <span className='dot red'></span>
            </td>
            <td><b>Invalid Ballots</b></td>
            <td><b>4%</b></td>
            <td>2,000</td>
          </tr>
        </table>
        </div>
      </div>
      </div>
      <h3>Registered Voters By Age and Gender</h3>
      <div className="section">
        <div className="voter-container">
        <div className="voter-details-box">
        <table>
          <tr>
           
            <td className='underline'><b>Male</b></td>
            <td className='underline'>80,000</td>
            <td className='underline'><b>47%</b></td>
            <td>
           
            </td>
          </tr>
          <tr>
           
           <td><b>Age 18 - 30</b></td>
           <td>30,000</td>
           <td><b>22%</b></td>
           <td>
           <span className='dot grey'></span>
           </td>
         </tr>

         <tr>
           <td><b>Age 31+</b></td>
           <td>50,000</td>
           <td><b>25%</b></td>
           <td>
           <span className='dot red'></span>
           </td>
         </tr>
        </table>
          </div>
        
      
          <div className="pie-chart">
               <div className="slice"></div>
               <div className="slice"></div> 
               <div className="slice"></div>
               <div className="slice"></div>
            </div>

    
          <div className="voter-details-box">
          <table>
          <tr>
           <td></td>
            <td className='underline'><b>Female</b></td>
            <td className='underline'>110,000</td>
            <td className='underline'><b>53%</b></td>
            <td>
           
            </td>
          </tr>
          <tr>
          <span className='dot green'></span>
           <td><b>Age 18 - 30</b></td>
           <td>50,000</td>
           <td><b>25%</b></td>
           <td>
           
           </td>
         </tr>

         <tr>
         <span className='dot black'></span>
           <td><b>Age 31+</b></td>
           <td>60,000</td>
           <td><b>27%</b></td>
           <td>
           
           </td>
         </tr>
        </table>

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

export default Results;
