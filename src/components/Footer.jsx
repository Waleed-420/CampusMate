import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <h2 className="footer-heading">Ready to start your journey?</h2>
      <Link to="/contact" className="contact-button">contact us</Link>
      <div className="footer-bottom">
        <p className="footer-left">© 2025 CompanyName. All rights reserved.</p>
        <div className="footer-right">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
