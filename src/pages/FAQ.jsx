import React, { useState, useEffect } from 'react';
import './Faq.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch('/data/faqs.json')
      .then(response => response.json())
      .then(data => setFaqs(data))
      .catch(error => console.error('Error loading FAQ data:', error));
  }, []);

  const toggleAnswer = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="faq-container">
      {faqs.map((faq, index) => (
        <div
          className={`faq-item ${openIndex === index ? 'open' : ''}`}
          key={index}
        >
          <div className="faq-question" onClick={() => toggleAnswer(index)}>
            <span>{faq.question}</span>
            <button className="arrow-btn">&#10148;</button>
          </div>
          <div className="faq-answer">{faq.answer}</div>
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default FAQ;
