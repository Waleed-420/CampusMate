import React from 'react';
import './FilterBar.css';

const cities = ['Lahore', 'Faisalabad', 'Karachi', 'Islamabad', 'Peshawar', 'Bahawalpur', 'Quetta'];

const FilterBar = ({ selectedFee, setSelectedFee, selectedCity, setSelectedCity,userPercentage, setUserPercentage}) => {
  return (
    <div className="filter-bar">
      <select className='price-filter' value={selectedFee} onChange={e => setSelectedFee(e.target.value)}>
        <option value="">All Fees</option>
        <option value="100000">Below 100,000</option>
        <option value="150000">Below 150,000</option>
        <option value="200000">Below 200,000</option>
      </select>
    <div className="city-filters">
  <h4>University Location</h4>
  <div className="city-options">
    <div
      className={`city-option ${selectedCity === '' ? 'selected' : ''}`}
      onClick={() => setSelectedCity('All')}
    >
      All
    </div>
    {cities.map(city => (
      <div
        key={city}
        className={`city-option ${selectedCity === city ? 'selected' : ''}`}
        onClick={() => setSelectedCity(city)}
      >
        {city}
      </div>
    ))}
  </div>
</div>


    </div>
  );
};

export default FilterBar;
