import React from 'react';
import { Link } from 'react-router-dom';
import './UniversityCard.css';

const UniversityCard = ({ uni }) => {
  return (
    <div className="university-card">
      <img src={uni.images[0]} alt={uni.name} />
      <h3>{uni.name}</h3>
      <p><strong>Courses:</strong> {uni.bachelorsCourses.join(', ')}</p>
      <p><strong>Scholarship:</strong> {uni.scholarship ? 'Applicable' : 'Not applicable'}</p>
      <Link to={`/university/${uni.id}`}>View Details</Link>
    </div>
  );
};

export default UniversityCard;
