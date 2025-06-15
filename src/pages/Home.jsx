import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import UniversityList from '../components/UniversityList';
import data from '../data/universities.json';
import './Home.css';
import Navbar from '../components/Navbar'
import Footer from '..//components/Footer'

const Home = () => {
  const [selectedFee, setSelectedFee] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [universities, setUniversities] = useState([]);
  const [userPercentage, setUserPercentage] = useState('');

  useEffect(() => {
    setUniversities(data);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="home-page">
      <FilterBar
        selectedFee={selectedFee}
        setSelectedFee={setSelectedFee}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        userPercentage={userPercentage}
        setUserPercentage={setUserPercentage}
      />
      <UniversityList
        universities={universities}
        selectedCity={selectedCity}
        selectedFee={selectedFee}
      />
    </div>
    <Footer/>
    </>
  );
};

export default Home;
