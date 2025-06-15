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

  useEffect(() => {
    fetch("../data/universities.json")
      .then(res => res.json())
      .then(data => {
        const simplifiedData = data.map(({ id, name }) => ({ id, name }));
        setUniversities(simplifiedData);
      })
      .catch(err => console.error("Error fetching universities:", err));
  }, []);

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

  try {
    const response = await fetch("http://localhost:5000/api/hostels", {
      method: "POST",
      body: formPayload,
    });
alert(1)
    if (response.ok) {
      const data = await response.json();
      alert("Hostel submitted successfully for admin approval.");
      
       setFormData({
        image: null,
        name: "",
        universityId: "",
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
    } else {
      const errorData = await response.json();
      alert("Error submitting hostel: " + errorData.error);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to submit hostel. Please try again later.");
  }
};


  return (
    <>
      <Navbar />
      <div className="home-container">
        <section className="hero-section">
          <h1>Hostel Manager</h1>
          <p>Submit hostel details for admin approval.</p>
        </section>

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
                <label>
                  <input type="checkbox" name="twoSeater" checked={formData.roomTypes.twoSeater} onChange={handleRoomTypeChange} />
                  2-Seater
                </label>
                <label>
                  <input type="checkbox" name="threeSeater" checked={formData.roomTypes.threeSeater} onChange={handleRoomTypeChange} />
                  3-Seater
                </label>
                <label>
                  <input type="checkbox" name="fullRoom" checked={formData.roomTypes.fullRoom} onChange={handleRoomTypeChange} />
                  Full Room
                </label>
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
      </div>
      <Footer />
    </>
  );
};

export default HostelManagerPage;
