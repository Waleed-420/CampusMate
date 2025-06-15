import React from 'react';
import UniversityCard from './UniversityCard';
import './UniversityList.css';

const UniversityList = ({ universities, selectedCity, selectedFee, userPercentage }) => {
  const filtered = universities.filter(uni => {
    const matchesCity = !selectedCity || selectedCity === 'All' || uni.location === selectedCity;
    const matchesFee = !selectedFee || uni.fee <= parseInt(selectedFee);
    const matchesPercentage = !userPercentage || parseFloat(userPercentage) >= uni.percentage;

    return matchesCity && matchesFee && matchesPercentage;
  });

  return (
    <div className="university-list">
      {filtered.length > 0 ? (
        filtered.map(uni => <UniversityCard key={uni.id} uni={uni} />)
      ) : (
        <p>No universities found for the selected filters.</p>
      )}
    </div>
  );
};

export default UniversityList;
