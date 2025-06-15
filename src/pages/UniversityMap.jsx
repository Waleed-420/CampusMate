
import React, { useState, useEffect } from 'react';
import universitiesData from '../data/universities.json';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export default function UniversityMapPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  useEffect(() => {
    const filtered = universitiesData.filter(u => {
      return (
        (!selectedCity || u.location === selectedCity) &&
        (!maxFee || u.fee <= parseInt(maxFee))
      );
    });
    setFilteredUniversities(filtered);
  }, [selectedCity, maxFee]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.onload = () => window.google && window.google.maps;
    document.body.appendChild(script);
  }, []);

  const showMap = (university) => {
    setSelectedUniversity(university);
    setTimeout(() => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: university.latitude, lng: university.longitude },
        zoom: 14
      });

      new window.google.maps.Marker({ position: { lat: university.latitude, lng: university.longitude }, map });

      new window.google.maps.Circle({
        map,
        center: { lat: university.latitude, lng: university.longitude },
        radius: 10000,
        fillColor: '#007bff',
        fillOpacity: 0.15,
        strokeWeight: 1
      });

      university.hostels.forEach(hostel => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(university.latitude, university.longitude),
          new window.google.maps.LatLng(hostel.latitude, hostel.longitude)
        );
        if (distance <= 10000) {
          new window.google.maps.Marker({
            position: { lat: hostel.latitude, lng: hostel.longitude },
            map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
        }
      });
    }, 500);
  };

  return (
    <div>
      <h2>Find Universities & Nearby Hostels</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select onChange={e => setSelectedCity(e.target.value)}>
          <option value=''>Select City</option>
          {[...new Set(universitiesData.map(u => u.location))].map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Fee"
          value={maxFee}
          onChange={e => setMaxFee(e.target.value)}
        />
      </div>

      {filteredUniversities.map(u => (
        <div key={u.id} style={{ marginBottom: '1rem' }}>
          <strong>{u.name}</strong> – Fee: {u.fee} PKR
          <button onClick={() => showMap(u)} style={{ marginLeft: '1rem' }}>Show on Map</button>
        </div>
      ))}

      {selectedUniversity && <div id="map" style={{ height: '500px', marginTop: '1rem' }}></div>}
    </div>
  );
}
