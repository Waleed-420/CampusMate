import React, { useState } from 'react';
import universities from '../data/universities.json';
import './UniversityCompare.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UniversityCompare = () => {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  const searchSuggestions = (query) => {
    return universities.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    return ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length;
  };

  const renderStars = (avg) => {
    const rounded = Math.round(avg);
    return '⭐'.repeat(rounded) + (rounded === 0 ? 'No ratings yet' : '');
  };

  const renderUniversityDetails = (university) => {
    if (!university) return null;

    const avgRating = getAverageRating(university.ratings).toFixed(1);

    return (
      <div className="university-card">
        <h3>{university.name}</h3>
        <p><strong>Location:</strong> {university.location}</p>
        <p><strong>Fee:</strong> PKR {university.fee.toLocaleString()}</p>
        <p><strong>Courses:</strong> {university.bachelorsCourses.join(', ')}</p>
        <p><strong>Scholarship:</strong> {university.scholarship ? 'Yes' : 'No'}</p>
        <p><strong>About:</strong> {university.about}</p>
        <p><strong>Average Rating:</strong> {avgRating} {renderStars(avgRating)}</p>
        <img src={university.images[0]} alt={university.name} className="uni-image" />
      </div>
    );
  };

  const renderComparisonSummary = () => {
    if (!selected1 || !selected2) return null;

    const cheaper = selected1.fee < selected2.fee ? selected1.name : selected2.name;
    const avg1 = getAverageRating(selected1.ratings);
    const avg2 = getAverageRating(selected2.ratings);
    const betterRated = avg1 === avg2 ? 'Both have equal ratings' : (avg1 > avg2 ? selected1.name : selected2.name);

    return (
      <div className="comparison-summary">
        <h2 style={{color:"#7ec9f5"}}>Comparison Summary</h2>
        <p style={{margin:"10px 0px"}}><strong>Cheaper University:</strong> {cheaper}</p>
        <p><strong>Higher Rated University:</strong> {betterRated}</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="compare-container">
        <div className="compare-column">
          <input
            type="text"
            placeholder="Search University..."
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
          />
          {query1 && (
            <ul className="suggestions">
              {searchSuggestions(query1).map((u) => (
                <li key={u.id} onClick={() => {
                  setSelected1(u);
                  setQuery1('');
                }}>
                  {u.name}
                </li>
              ))}
            </ul>
          )}
          {renderUniversityDetails(selected1)}
        </div>

        <div className="compare-column">
          <input
            type="text"
            placeholder="Search University..."
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
          />
          {query2 && (
            <ul className="suggestions">
              {searchSuggestions(query2).map((u) => (
                <li key={u.id} onClick={() => {
                  setSelected2(u);
                  setQuery2('');
                }}>
                  {u.name}
                </li>
              ))}
            </ul>
          )}
          {renderUniversityDetails(selected2)}
        </div>
      </div>
      {renderComparisonSummary()}
      <Footer />
    </>
  );
};

export default UniversityCompare;
