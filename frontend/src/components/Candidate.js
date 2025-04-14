import { useState } from "react";
import { motion } from "framer-motion";
import { ImCross } from "react-icons/im";
import styles from "./YourStyles.module.css"; // adjust this to your actual CSS module

const CandidateCard = ({ candidate, deleteCandidate, handleVote, positions, votedPositions }) => {
  const [showIcon, setShowIcon] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const positionName = positions.find(pos => pos.id === parseInt(candidate.position_id))?.name || "Unknown";

  return (
    <div
      className={styles.candidateCardContainer}
      onMouseEnter={() => setShowIcon(candidate.id)}
      onMouseLeave={() => setShowIcon(null)}
    >
      {showIcon === candidate.id && (
        <a className={styles.close} onClick={() => deleteCandidate(candidate.id)}>
          <ImCross />
        </a>
      )}

      <motion.div
        className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* FRONT SIDE */}
        <div className={styles.cardFront}>
          <img
            className={styles.candidatePic}
            src={
              candidate.imageUrl.startsWith("http")
                ? candidate.imageUrl
                : `http://localhost:5000/${candidate.imageUrl}`
            }
            alt="Candidate"
          />
          <h2 className={styles.name}>{candidate.names}</h2>
          <p>{positionName}</p>
          <div className={styles.button}>
            <button className={styles.description} onClick={() => setIsFlipped(true)}>
              Details
            </button>
            <button
              className={styles.vote}
              onClick={() => handleVote(candidate.id, candidate.position_id)}
              disabled={votedPositions.includes(Number(candidate.position_id))}
            >
              {votedPositions.includes(Number(candidate.position_id)) ? "Voted" : "Vote"}
            </button>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={styles.cardBack}>
        <h2 className={styles.name}>About {candidate.names}</h2>
          <p>{candidate.description || "No additional info provided."}</p>
          <button onClick={() => setIsFlipped(false)} className={styles.backButton}>
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidateCard;
