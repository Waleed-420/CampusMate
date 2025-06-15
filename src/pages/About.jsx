import React, { useState } from 'react';
import './About.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';




function About() {
  return (
    <>
    <Navbar/>
    <div className='about'>
        <h1> About CampusMate</h1>
        <div className='para'>
            <p>CampusMate was created with a mission: to make university selection easy for students across Pakistan. We understand how confusing and overwhelming this process can be — that's why we built CampusMate to give you personalized recommendations, scholarship updates, and even hostel options — all in one place!</p>
        </div>
    </div>
    <Footer/>
    
    </>
  )
}

export default About