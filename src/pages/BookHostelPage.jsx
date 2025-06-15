import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './BookHostel.css';

const BookHostelPage = () => {
  const [universities, setUniversities] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchUniversities();
    fetchApprovedHostels();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch("/data/universities.json");
      const data = await res.json();
      setUniversities(data);
    } catch (err) {
      console.error("Error fetching universities", err);
    }
  };

  const fetchApprovedHostels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hostels/approved");
      const data = await res.json();
      setHostels(data);
    } catch (err) {
      console.error("Error fetching hostels", err);
    }
  };

  const handleUniversitySelect = (e) => {
    const uniId = e.target.value;
    setSelectedUniversity(uniId);
    setSelectedHostel(null);
    setSelectedRoomType("");
    const filtered = hostels.filter(h => h.universityId === uniId);
    setFilteredHostels(filtered);
  };

  const handleApply = async () => {
    if (!selectedHostel || !selectedRoomType) {
      alert("Please select a hostel and room type");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/hostels/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          hostelId: selectedHostel._id,
          roomType: selectedRoomType,
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Application sent successfully!");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Book Hostel</h1>

        <div className="university-select">
          <label>Select University:</label>
          <select value={selectedUniversity} onChange={handleUniversitySelect}>
            <option value="">-- Select University --</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
        </div>

        {selectedUniversity && (
          <>
            <div className="hostel-grid">
              {filteredHostels.length === 0 ? (
                <p>No hostels available for this university.</p>
              ) : (
                filteredHostels.map((hostel) => (
                  <div
                    key={hostel._id}
                    className={`hostel-card ${selectedHostel?._id === hostel._id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedHostel(hostel);
                      setSelectedRoomType("");
                    }}
                  >
                    <h3>{hostel.name}</h3>
                    <p><strong>Owner:</strong> {hostel.owner?.username} ({hostel.owner?.email})</p>
                    <div className="room-prices">
                      <p><strong>Prices:</strong></p>
                      <ul>
                        {hostel.roomTypes.twoSeater && <li>2-Seater: ${hostel.prices.price2Seater}</li>}
                        {hostel.roomTypes.threeSeater && <li>3-Seater: ${hostel.prices.price3Seater}</li>}
                        {hostel.roomTypes.fullRoom && <li>Full Room: ${hostel.prices.priceFullRoom}</li>}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedHostel && (
              <div className="booking-form">
                <h2>Apply for {selectedHostel.name}</h2>
                <label>Select Room Type:</label>
                <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
                  <option value="">-- Select Room Type --</option>
                  {selectedHostel.roomTypes.twoSeater && <option value="twoSeater">2-Seater</option>}
                  {selectedHostel.roomTypes.threeSeater && <option value="threeSeater">3-Seater</option>}
                  {selectedHostel.roomTypes.fullRoom && <option value="fullRoom">Full Room</option>}
                </select>
                <button onClick={handleApply}>Apply</button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookHostelPage;
