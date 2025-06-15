import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './HostelManager.css';

const HostelManagerPage = () => {
  const [universities, setUniversities] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    universityId: "",
    ownerPhone: "",
    roomTypes: {
      twoSeater: false,
      threeSeater: false,
      fullRoom: false
    },
    prices: {
      price2Seater: "",
      price3Seater: "",
      priceFullRoom: ""
    }
  });

  const [activeTab, setActiveTab] = useState("submit");
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("../data/universities.json")
      .then(res => res.json())
      .then(data => {
        const simplifiedData = data.map(({ id, name }) => ({ id, name }));
        setUniversities(simplifiedData);
      })
      .catch(err => console.error("Error fetching universities:", err));
  }, []);

  useEffect(() => {
    if (activeTab === "myhostels") {
      fetchMyHostels();
    }
  }, [activeTab]);

  const fetchMyHostels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/hostels/my-submissions", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log("Fetched hostels:", data);
      setHostels(data);
    } catch (err) {
      console.error("Error fetching hostels:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "name" || name === "universityId") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoomTypeChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      roomTypes: { ...formData.roomTypes, [name]: checked }
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      prices: { ...formData.prices, [name]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("image", formData.image);
    formPayload.append("name", formData.name);
    formPayload.append("universityId", formData.universityId);
    formPayload.append("roomTypes", JSON.stringify(formData.roomTypes));
    formPayload.append("prices", JSON.stringify(formData.prices));
    formPayload.append("ownerPhone", formData.ownerPhone);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/hostels", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formPayload
      });

      if (response.ok) {
        alert("Hostel submitted successfully for admin approval.");
        setFormData({
          image: null,
          name: "",
          universityId: "",
          ownerPhone: "",
          roomTypes: { twoSeater: false, threeSeater: false, fullRoom: false },
          prices: { price2Seater: "", price3Seater: "", priceFullRoom: "" }
        });
      } else {
        const errorData = await response.json();
        alert("Error submitting hostel: " + errorData.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit hostel. Please try again later.");
    }
  };

  const handleHostelClick = async (hostel) => {
    setSelectedHostel(hostel);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/hostels/${hostel._id}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const handleApprove = async (hostelId, index) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/hostels/${hostelId}/applications/${index}/approve`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        alert("Application approved!");
        handleHostelClick(selectedHostel);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error approving application");
    }
  };

  const handleDecline = async (hostelId, index) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/hostels/${hostelId}/applications/${index}/decline`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        alert("Application declined.");
        handleHostelClick(selectedHostel);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error declining application");
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="manager-tabs">
          <button className={activeTab === "submit" ? "active" : ""} onClick={() => setActiveTab("submit")}>Submit Hostel</button>
          <button className={activeTab === "myhostels" ? "active" : ""} onClick={() => setActiveTab("myhostels")}>My Hostels</button>
        </div>

        {activeTab === "submit" && (
          <section className="features-section">
            <h2>Add New Hostel</h2>
            <form className="hostel-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hostel Image:</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Hostel Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Owner Phone Number:</label>
                <input type="text" name="ownerPhone" value={formData.ownerPhone} onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Closest University:</label>
                <select name="universityId" value={formData.universityId} onChange={handleChange} required>
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room Types Provided:</label>
                <div>
                  <label><input type="checkbox" name="twoSeater" checked={formData.roomTypes.twoSeater} onChange={handleRoomTypeChange} /> 2-Seater</label>
                  <label><input type="checkbox" name="threeSeater" checked={formData.roomTypes.threeSeater} onChange={handleRoomTypeChange} /> 3-Seater</label>
                  <label><input type="checkbox" name="fullRoom" checked={formData.roomTypes.fullRoom} onChange={handleRoomTypeChange} /> Full Room</label>
                </div>
              </div>

              {formData.roomTypes.twoSeater && (
                <div className="form-group">
                  <label>Price for 2-Seater:</label>
                  <input type="number" name="price2Seater" value={formData.prices.price2Seater} onChange={handlePriceChange} required />
                </div>
              )}

              {formData.roomTypes.threeSeater && (
                <div className="form-group">
                  <label>Price for 3-Seater:</label>
                  <input type="number" name="price3Seater" value={formData.prices.price3Seater} onChange={handlePriceChange} required />
                </div>
              )}

              {formData.roomTypes.fullRoom && (
                <div className="form-group">
                  <label>Price for Full Room:</label>
                  <input type="number" name="priceFullRoom" value={formData.prices.priceFullRoom} onChange={handlePriceChange} required />
                </div>
              )}

              <button className="quiz-button" type="submit">Submit for Approval</button>
            </form>
          </section>
        )}

        {activeTab === "myhostels" && (
          <section className="features-section">
            <h2>My Submitted Hostels</h2>

            {hostels.length === 0 ? (
              <p>No hostels submitted yet.</p>
            ) : (
              <ul className="hostel-list">
                {hostels.map((hostel) => (
                  <li key={hostel._id} className="hostel-card" onClick={() => handleHostelClick(hostel)}>
                    <h3>{hostel.name}</h3>
                    <p><strong>University:</strong> {hostel.universityId}</p>
                    <p><strong>Status:</strong> {hostel.status}</p>
                  </li>
                ))}
              </ul>
            )}

            {selectedHostel && (
              <div className="application-section">
                <h3>Applications for {selectedHostel.name}</h3>
                {applications.length === 0 ? (
                  <p>No applications yet.</p>
                ) : (
                  <ul className="application-list">
                    {applications.map((app, index) => (
                      <li key={index} className="application-card">
                        <p><strong>Student:</strong> {app.applicant.username} ({app.applicant.email})</p>
                        <p><strong>Room Type:</strong> {app.roomType}</p>
                        <p><strong>Status:</strong> {app.status}</p>

                        {app.status === 'pending' && (
                          <div className="action-buttons">
                            <button onClick={() => handleApprove(selectedHostel._id, index)}>Approve</button>
                            <button onClick={() => handleDecline(selectedHostel._id, index)}>Not Available</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};

export default HostelManagerPage;
