import { Link } from 'react-router-dom';
import styles from '../styles/sidebar.module.css';
import { useState } from 'react';
import {FaChartLine} from "react-icons/fa6";
import {FaUsersViewfinder} from "react-icons/fa6";
import {FaRankingStar} from "react-icons/fa6";
import {FaUsers} from "react-icons/fa6";
import {GiVote} from "react-icons/gi";
import {IoMdSettings} from "react-icons/io";
import {MdOutlineLogout} from "react-icons/md";



const Sidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.details}>
          <h2>Menu</h2>
          <i
            className="fa-solid fa-arrow-left"
            onClick={handleClick}
            style={{ display: isOpen ? "block" : "none" }}
          ></i>
        </div>

        <ul className={styles.navList}>
          <li onClick={() => setActiveComponent("dashboard")}>
            <a href="#">
            <i> <FaChartLine /></i> 
              <span className={styles.linksName}>Dashboard</span>
            </a>
            <span className={styles.tooltip}>Dashboard</span>
          </li>
          <li onClick={() => setActiveComponent("candidates")}>
            <a href="#">
            <i> <FaUsersViewfinder /></i> 
              <span className={styles.linksName}>Candidates</span>
            </a>
            <span className={styles.tooltip}>Candidates</span>
          </li>
          <li onClick={() => setActiveComponent("results")}>
            <a href="#">
              <i><FaRankingStar/></i>
              <span className={styles.linksName}>Results</span>
            </a>
            <span className={styles.tooltip}>Results</span>
          </li>
          <li onClick={() => setActiveComponent("voters")}>
            <a href="#">
            <i ><FaUsers /></i>
              <span className={styles.linksName}>Voters</span>
            </a>
            <span className={styles.tooltip}>Voters</span>
          </li>
          <li onClick={() => setActiveComponent("elections")}>
            <a href="#">
              <i><GiVote/></i>
              <span className={styles.linksName}>Elections</span>
            </a>
            <span className={styles.tooltip}>Elections</span>
          </li>
          <li onClick={() => setActiveComponent("settings")}>
            <a href="#">
              <i><IoMdSettings/></i>
              <span className={styles.linksName}>Settings</span>
            </a>
            <span className={styles.tooltip}>Settings</span>
          </li>

          <li>
            <Link to="/">
              <i><MdOutlineLogout/></i>
              <span className={styles.linksName}>Logout</span>
            </Link>
            <span className={styles.tooltip}>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
