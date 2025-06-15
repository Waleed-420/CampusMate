import React, { useEffect, useState } from "react";
import "./ScholarshipsTab.css";
import { X, School, Home, DollarSign } from "lucide-react";

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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${day}${daySuffix}, ${year}`;
};


const ScholarshipsTab = () => {
  const [savedScholarships, setSavedScholarships] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/scholarships/saved", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSavedScholarships(data))
      .catch(err => console.error("Failed to fetch saved scholarships", err));
  }, []);

  const removeScholarship = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/scholarships/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setSavedScholarships(prev => prev.filter(s => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove scholarship");
      }
    } catch (err) {
      console.error("Error removing scholarship:", err);
    }
  };

  return (
    <div className="scholarships-tab">
      <h2>Saved Scholarships</h2>
      {savedScholarships.length === 0 ? (
        <p>You haven't saved any scholarships yet.</p>
      ) : (
        <div className="scholarship-grid">
          {savedScholarships.map(s => (
            <div key={s.id} className="scholarship-card">
              <X className="remove-icon" onClick={() => removeScholarship(s.id)} />
              <h3>{s.type} Scholarship</h3>
              <div><strong>Coverage:</strong></div>
              <div className="icons-wrapper">{getCoverageIcons(s.coverage)}</div>
              <p><strong>Valid Till:</strong> {formatDate(s.validTill)}</p>
              <a href={s.registrationLink} target="_blank" rel="noreferrer">
                <button>Apply Now</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsTab;
