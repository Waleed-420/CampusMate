import React, { useEffect, useState } from 'react';
import { School, Home, DollarSign, Heart } from 'lucide-react'; 
import './ScholarshipsPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/scholarships') 
      .then((res) => res.json())
      .then((data) => setScholarships(data.reverse())) 
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/scholarships/saved', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setSavedScholarships(data.map(s => s.id));
      } catch (err) {
        console.error('Error fetching saved scholarships:', err);
      }
    };

    fetchSaved();
  }, []);

  const handleToggleSave = async (scholarship) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to save scholarships.');

    const isSaved = savedScholarships.includes(scholarship.id);
    const url = isSaved 
      ? 'http://localhost:5000/api/scholarships/remove' 
      : 'http://localhost:5000/api/scholarships/save';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scholarship, id: scholarship.id })
      });

      const data = await res.json();
      if (res.ok) {
        if (isSaved) {
          setSavedScholarships(prev => prev.filter(sid => sid !== scholarship.id));
        } else {
          setSavedScholarships(prev => [...prev, scholarship.id]);
        }
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error toggling scholarship:', error);
    }
  };

  const getCoverageIcons = (coverage) => {
    const lower = coverage.toLowerCase();
    const icons = [];

    if (lower.includes("university") || lower.includes("fee")) {
      icons.push(
        <div key="university" className="icon-with-label">
          <School size={24} className="scholarship-icon" />
          <span>University</span>
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
              <button
                className="save-heart"
                onClick={() => handleToggleSave(scholarship)}
                title="Save Scholarship"
              >
                <Heart 
                  size={20} 
                  fill={savedScholarships.includes(scholarship.id) ? 'crimson' : 'none'} 
                  color="crimson" 
                />
              </button>
              <h3>{scholarship.type} Scholarship</h3>
              <div className="coverage-row">
                <strong>Coverage</strong>
                <span className="icons-wrapper">{getCoverageIcons(scholarship.coverage)}</span>
              </div>
              <p><strong>Last date to apply:</strong> {new Date(scholarship.validTill).toLocaleString()}</p>
              <a href={scholarship.registrationLink} target="_blank" rel="noreferrer">
                <button className='button'>Apply Now</button>
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
