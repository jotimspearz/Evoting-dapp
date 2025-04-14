import { FaShieldAlt, FaEye, FaUserCheck } from "react-icons/fa";
import styles from "../styles/landingPage.module.css";
import { Link } from "react-router-dom";

export default function VotingLandingPage() {
  return (
    <div className={styles.landingMain}>
      {/* Hero Section */}
      <section className={styles.landingHero}>
        <h1 className={styles.landingHeading}>Secure & Transparent E-Voting</h1>
        <p>Your vote, your power. Cast it securely with blockchain.</p>
        <Link to='/login'>
          <button className={styles.landingCTA}>Get Started</button>
        </Link>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><FaShieldAlt /></span>
          <div>
            <h2>Blockchain Security</h2>
            <p>Immutable and tamper-proof voting</p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><FaEye /></span>
          <div>
            <h2>Real-Time Transparency</h2>
            <p>Track election results instantly</p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><FaUserCheck /></span>
          <div>
            <h2>Easy Voter Registration</h2>
            <p>Quick and seamless signup</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection}>
        <h3>How it Works</h3>
        <div className={styles.howStep}>
          <p><span className={styles.howIcon}>1</span>Connect MetaMask securely</p>
        </div>
        <div className={styles.howStep}>
          <p><span className={styles.howIcon}>2</span>Register with your details</p>
        </div>
        <div className={styles.howStep}>
          <p><span className={styles.howIcon}>3</span>Verify your eligibility</p>
        </div>
        <div className={styles.howStep}>
          <p><span className={styles.howIcon}>4</span>Cast your vote with confidence</p>
        </div>
        <div className={styles.howStep}>
          <p><span className={styles.howIcon}>5</span>Track real-time election results</p>
        </div>
      </section>
    </div>
  );
} 
