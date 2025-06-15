import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import universities from '../data/universities.json';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './UniversityPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const universityIcon = new L.DivIcon({
  html: `<div style="font-size: 28px;">🎓</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const hostelIcon = new L.DivIcon({
  html: `<div style="font-size: 26px;">🏠</div>`,
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const UniversityPage = () => {
  const { id } = useParams();
  const university = universities.find(u => u.id === id);
  const [ratings, setRatings] = useState([]);
  const [stars, setStars] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!university) return;
    fetch(`http://localhost:5000/ratings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ratings');
        return res.json();
      })
      .then(data => setRatings(data))
      .catch(() => setRatings([]));
  }, [id, university]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('You must be logged in to submit a rating.');
      return;
    }
    if (!stars) {
      setError('Please select a star rating.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          universityId: id,
          stars: parseInt(stars, 10),
          comment
        })
      });
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMsg = 'Failed to submit rating';
        if (contentType && contentType.includes('application/json')) {
          const resData = await response.json();
          errorMsg = resData.error || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const updatedRatings = await fetch(`http://localhost:5000/ratings/${id}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch updated ratings');
        return res.json();
      });
      setRatings(updatedRatings);
      setStars('');
      setComment('');
      setSuccess('Rating submitted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!university) {
    return <p>University not found.</p>;
  }

  const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1) : 'N/A';

  return (
    <>
      <Navbar />
      <div className="university-page">
        <Carousel showThumbs={false} infiniteLoop autoPlay interval={1500} transitionTime={500} stopOnHover={false}>
          {university.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${university.name} ${index + 1}`} />
            </div>
          ))}
        </Carousel>

        <div className="uni-details">
          <h2>{university.name}</h2>
          <p><strong>About:</strong> {university.about}</p>
          <p><strong>Fee:</strong> Rs {university.fee.toLocaleString()}</p>
          <p><strong>Scholarship:</strong> {university.scholarship ? 'Applicable' : 'Not Applicable'}</p>
          <p><strong>Avg Rating:</strong> ⭐ {avgRating}</p>
          <a href={university.enrollmentLink} target="_blank" rel="noopener noreferrer">
            Visit Official Enrollment Page
          </a>
        </div>

        <div className="map-container" style={{ height: '350px', width: '100%', margin: '2rem 0' }}>
  <MapContainer
    center={
      university.latitude && university.longitude
        ? [university.latitude, university.longitude]
        : [31.5204, 74.3587] // Default location (Lahore)
    }
    zoom={university.latitude && university.longitude ? 15 : 6}
    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    scrollWheelZoom={false}
  >
    <TileLayer
      attribution='&copy; OpenStreetMap'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {university.latitude && university.longitude && (
      <>
        <Marker position={[university.latitude, university.longitude]} icon={universityIcon}>
          <Popup>
            <strong>{university.name}</strong><br />
            Main Campus Location<br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${university.latitude},${university.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🚗 Get Directions
            </a>
          </Popup>
        </Marker>

        {university.hostels?.map((h, i) =>
          h.latitude && h.longitude ? (
            <React.Fragment key={i}>
              <Marker position={[h.latitude, h.longitude]} icon={hostelIcon}>
                <Popup>
                  <strong>{h.name}</strong><br />
                  Rs {h.price} – {h.roomSharing}<br />
                  {h.distance}<br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🚗 Get Directions
                  </a>
                </Popup>
              </Marker>
              <Polyline
                positions={[[university.latitude, university.longitude], [h.latitude, h.longitude]]}
                pathOptions={{ color: '#007bff', weight: 3 }}
              />
            </React.Fragment>
          ) : null
        )}
      </>
    )}
  </MapContainer>
</div>


        <div className="rating-form">
          <div className="all-ratings">
            <h5>All Ratings:</h5>
            {ratings.length === 0 && <p>No ratings yet.</p>}
            {ratings.map((r) => (
              <div key={r._id} className="rating-item">
                <strong>{r.username || 'Anonymous'}</strong>: {'⭐'.repeat(r.stars)}
                {r.comment && <p>{r.comment}</p>}
              </div>
            ))}
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form className='rate-me' onSubmit={handleSubmit}>
            <h4>Leave a Rating</h4>
            <select required value={stars} onChange={(e) => setStars(e.target.value)}>
              <option value="">Rating </option>
              {[1, 2, 3, 4, 5].map(s => (
                <option key={s} value={s}>{'⭐'.repeat(s)}</option>
              ))}
            </select>
            <textarea className="custom-textarea" placeholder="Leave a comment (optional)" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
            <button type="submit">Submit Rating</button>
          </form>
        </div>

        <div className="hostels">
          <h3>Nearby Hostels</h3>
          <div className="hostel-list">
            {university.hostels.map((h, idx) => (
              <div key={idx} className="hostel-card">
                <img src={h.image} alt={h.name} />
                <h4>{h.name}</h4>
                <p><strong>Room:</strong> {h.roomSharing}</p>
                <p><strong>Price:</strong> Rs {h.price}</p>
                <p><strong>Distance:</strong> {h.distance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UniversityPage;
