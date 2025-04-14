
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import VotersPage from "./pages/VotersPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import Registration from "./components/Registration";
import Login from './components/Login'
import AuthComponent from "./components/AuthComponent";
import VotingLandingPage from "./pages/LandingPage";

// Create a wrapper to handle animations
const AnimatedRoutes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  const AnimatedPage = ({ children }) => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/loginpage" element={<AnimatedPage><AuthComponent /></AnimatedPage>} />
        <Route path="/" element={<AnimatedPage><VotingLandingPage /></AnimatedPage>} />
        <Route path="/home" element={<AnimatedPage><VotingLandingPage /></AnimatedPage>} />
        <Route path="/votersPage" element={<AnimatedPage><VotersPage /></AnimatedPage>} />
        <Route path="/adminPage" element={<AnimatedPage><AdminPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Registration /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;

