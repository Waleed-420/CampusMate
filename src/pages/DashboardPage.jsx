import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HostelStatusTab from "../components/HostelStatusTab";
import ScholarshipsTab from "../components/ScholarshipsTab";

import './DashboardPage.css';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("hostel");

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="tabs">
          <button className={activeTab === "hostel" ? "active" : ""} onClick={() => setActiveTab("hostel")}>
            Booked Hostel
          </button>
          <button className={activeTab === "scholarship" ? "active" : ""} onClick={() => setActiveTab("scholarship")}>
            Scholarships
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "hostel" ? <HostelStatusTab /> : <ScholarshipsTab />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
