import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Results from "../components/Results";
import CandidateProfiles from "../components/Candidates";
import Settings from "../components/Settings";
import Dashboard from "../components/Dashboard";
import Info from "../components/Info";
import Voters from "../components/Voters";
import Elections from "../components/Elections";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "results":
        return <Results />;
      case "candidates":
        return <CandidateProfiles />;
      case "settings":
        return <Settings />;
      case "elections":
        return <Elections />;
      case "voters":
        return <Voters />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const sidebarVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Zoom Animated Sidebar */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={sidebarVariants}
        transition={{ duration: 0.4 }}
      >
        <Sidebar setActiveComponent={setActiveComponent} />
      </motion.div>

      {/* Animated Content Area */}
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.4 }}
          >
            {renderComponent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;


