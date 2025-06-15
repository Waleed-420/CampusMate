import React, { useEffect, useState } from 'react';
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

  return (
    <>
    <Navbar/>
    <div className="scholarship-page">
      <h2>Available Scholarships</h2>
      <div className="scholarship-grid">
        {scholarships.map((scholarship) => (
          <div className="scholarship-card" key={scholarship.id}>
            <h3>{scholarship.type} Scholarship</h3>
            <p><strong>Coverage:</strong> {scholarship.coverage}</p>
            <p><strong>Posted:</strong> {new Date(scholarship.createdAt).toLocaleString()}</p>
            <a href={scholarship.registrationLink} target="_blank" rel="noreferrer">
              <button>Apply Now</button>
            </a>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ScholarshipsPage;
