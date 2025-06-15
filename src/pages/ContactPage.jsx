import React, { useState } from 'react';
import './ContactPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('Message sent successfully!');
      setFormData({ username: '', email: '', message: '' });
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className='parent'>
        <h1 className='title'>Contact Us</h1>
        <div className="contact-container">
          {status && <p className="status-message">{status}</p>}
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message..."
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
