import React, { useEffect, useState } from 'react';
import { School, Home, DollarSign } from 'lucide-react';
import './ScholarshipsPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/scholarships') 
      .then((res) => res.json())
      .then((data) => setScholarships(data.reverse())) 
      .catch((err) => console.error('Error:', err));
  }, []);

  const getCoverageIcons = (coverage) => {
  const lower = coverage.toLowerCase();
  const icons = [];

  if (lower.includes("university" || coverage.includes("Fee"))) {
    icons.push(
      <div key="university" className="icon-with-label">
        <School size={24} className="scholarship-icon" />
        <span>University</span>
      </div>
    );
  }
  if (lower.includes("fee")) {
    icons.push(
      <div key="university" className="icon-with-label">
        <School size={24} className="scholarship-icon" />
        <span>Fee</span>
      </div>
    );
  }

  if (lower.includes("hostel")) {
    icons.push(
      <div key="hostel" className="icon-with-label">
        <Home size={24} className="scholarship-icon" />
        <span>Hostel</span>
      </div>
    );
  }

  if (lower.includes("stipend")) {
    icons.push(
      <div key="stipend" className="icon-with-label">
        <DollarSign size={24} className="scholarship-icon" />
        <span>Stipend</span>
      </div>
    );
  }

  return icons;
};


  return (
    <>
      <Navbar />
      <div className="scholarship-page">
        <h2>Available Scholarships</h2>
        <div className="scholarship-grid">
          {scholarships.map((scholarship) => (
            <div className="scholarship-card" key={scholarship.id}>
              <h3>{scholarship.type} Scholarship</h3>
              <div className="coverage-row">
                <strong>Coverage</strong>
                <span className="icons-wrapper">{getCoverageIcons(scholarship.coverage)}</span>
              </div>
              
              <p><strong>Last date to apply:</strong> {new Date(scholarship.validTill).toLocaleString()}</p>
              <a href={scholarship.registrationLink} target="_blank" rel="noreferrer">
                <button>Apply Now</button>
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScholarshipsPage;
