import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

function Help() {
  return (
    <div className="help-container bg-[#1c1c1c] text-silver p-10 min-h-screen">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <Link to="/" className="back-dashboard-btn">Back</Link>
      </div>
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <ul className="mb-10">
        <li className="mb-4">
          <strong>What is SurveyScape?</strong>
          <p>SurveyScape is a platform that allows you to create, visualize, and grow your surveys with ease.</p>
        </li>
        <li className="mb-4">
          <strong>How do I create a survey?</strong>
          <p>You can create a survey by navigating to the 'Create Survey' section after logging in.</p>
        </li>
        <li className="mb-4">
          <strong>How can I visualize my data?</strong>
          <p>Visualize your data using our built-in analytics tools available in the dashboard.</p>
        </li>
      </ul>
      <h2 className="text-3xl font-semibold mb-6">Contact Customer Care</h2>
      <form className="bg-[#2d2d2d] p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg mb-2">Name:</label>
          <input type="text" id="name" name="name" className="w-full p-2 rounded bg-transparent text-white" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg mb-2">Email:</label>
          <input type="email" id="email" name="email" className="w-full p-2 rounded bg-transparent text-white" required />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-lg mb-2">Message:</label>
          <textarea id="message" name="message" className="w-full p-2 rounded bg-transparent text-white" required></textarea>
        </div>
        <button type="submit" className="bg-silver text-[#1c1c1c] font-bold py-2 px-4 rounded-full hover:bg-silver-light transition-all duration-300">Submit</button>
      </form>
    </div>
  );
}

export default Help; 