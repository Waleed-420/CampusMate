import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
    <Navbar/>
    <div className="home-container">
      <section className="hero-section">
        <h1>
          Find Your Perfect University
        </h1>
        <p>
          CampusMate makes university selection easy, smart and tailored to you!
        </p>
        <Link to="/quiz" className="quiz-button">Take the Quiz</Link>
      </section>

      <section className="features-section">
        <h2>our Features</h2>
        <div className="features-grid">
          <Link to="/finder" className="feature-card">
            <h3>university Finder</h3>
            <p>Enter your academic preferences and budget, and find universities matching your dreams.</p>
          </Link>
          <Link to="/scholarships" className="feature-card">
            <h3>scholarships</h3>
            <p>Get real-time alerts for scholarships to fund your studies.</p>
          </Link>
          <Link to="/hostels" className="feature-card">
            <h3>Hostel Booking</h3>
            <p>Find and book hostels near your university directly through CampusMate.</p>
          </Link>
          <Link to="/compare" className="feature-card">
            <h3>Compare universities</h3>
            <p>Easily compare universities side by side based on your preferences.</p>
          </Link>
          <Link to="/dashboard" className="feature-card">
            <h3>Dashboard</h3>
            <p>Access your personalized data, saved search and alerts.</p>
          </Link>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default HomePage;
