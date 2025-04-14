import React from "react";
import Sidebar from '../components/Sidebar'
import { useState } from "react";

import Results from "../components/Results";
import Candidates from "../components/Candidates";
import Settings from "../components/Settings";
import Dashboard from "../components/Dashboard";
import Info from "../components/Info";
import Voters from "../components/Voters";

const VotersPage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard"); // Default to "results"

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveComponent={setActiveComponent} />

      {/* Main Content Area */}
      <div className="content">
      {activeComponent === "dashboard" && <Dashboard />}
        {activeComponent === "results" && <Results />}
        {activeComponent === "candidates" && <Candidates />}
        {activeComponent === "settings" && <Settings />}
        {activeComponent === "info" && <Info />}
        {activeComponent === "voters" && <Voters />}
        
      </div>
    </div>
  );
};
export default VotersPage;
