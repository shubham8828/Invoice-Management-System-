import React from 'react';
import './About.css';  // You can style the About page separately in this CSS file

const About = () => {
  return (
    <div className="about-container">
      <h1>About AIMPS</h1>
      <p>
        Welcome to AIMPS (Advanced Invoice Management & Payment Solutions), your one-stop platform for streamlining invoicing and payment processes. Our goal is to offer a seamless solution for businesses and individuals looking to manage their invoicing more efficiently.
      </p>
      <h2>What We Offer</h2>
      <ul>
        <li>Automated Invoice Creation</li>
        <li>Customizable Invoice Templates</li>
        <li>Smart Payment Solutions via QR codes and Payment Gateways</li>
        <li>AI-driven Insights and Advanced Reporting</li>
        <li>Tax Calculation and Management Tools</li>
      </ul>
      <h2>Our Mission</h2>
      <p>
        At AIMPS, our mission is to make invoice management smarter and easier. We aim to reduce manual work, improve accuracy, and offer a reliable platform that helps businesses of all sizes handle their financial processes effectively.
      </p>
      <h2>Why Choose AIMPS?</h2>
      <p>
        AIMPS stands out with its user-friendly interface, powerful automation features, and AI-enhanced tools. Whether you're a small business owner or an enterprise, our solution adapts to your needs and ensures efficient financial management.
      </p>
      <h2>Our Team</h2>
      <p>
        AIMPS is developed by a dedicated team of passionate individuals, including <strong>Shubham Vishwakarma</strong> and <strong>Vikas Vishwakarma</strong>, under the guidance of <strong>Prof. Vandana Maurya</strong> at BK Birla College of Arts, Commerce & Science, Kalyan. We believe in continuous innovation to meet the ever-evolving needs of our users.
      </p>
    </div>
  );
};

export default About;
