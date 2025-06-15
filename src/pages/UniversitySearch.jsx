import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import universitiesData from "../data/universities.json";

export default function UniversitySearch() {
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({ fee: "", score: "", city: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setUniversities(universitiesData); 
  }, []);

  const filteredUniversities = universities.filter(uni => {
    return (
      (!filters.city || uni.location === filters.city) &&
      (!filters.fee || uni.fee <= parseInt(filters.fee))
    );
  });

  return (
    <div className="search-page">
      <div className="filters">
        <select onChange={e => setFilters({ ...filters, fee: e.target.value })}>
          <option value="">All Fees</option>
          <option value="100000">Below 100,000</option>
          <option value="150000">Below 150,000</option>
          <option value="200000">Below 200,000</option>
        </select>

        <select onChange={e => setFilters({ ...filters, city: e.target.value })}>
          <option value="">All Cities</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
        </select>
      </div>

      <div className="university-list">
        {filteredUniversities.map(uni => (
          <div
            className="university-card"
            key={uni.id}
            onClick={() => navigate(`/university/${uni.id}`)}
          >
            <img src={uni.images[0]} alt={uni.name} />
            <h3>{uni.name}</h3>
            <p>{uni.location}</p>
            <p>Fee: {uni.fee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}