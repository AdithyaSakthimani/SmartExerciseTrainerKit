import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Add your CSS styles here
import NoteContext from './NoteContext';


const HomePage = () => { 
    return (
        <div className="app-container">
          {/* Hero Section */}
          <section className="hero">
            <h1>Track, Improve, Elevate</h1>
            <p>Your AI-powered fitness companion to perfect your form and achieve your goals.</p>
            <Link to='/tracker'>
            <button className="cta-button">Get Started</button>
            </Link>
          </section>
    
          {/* Features Section */}
          <section id="features" className="features">
            <h2 className='feature-hed'>Features</h2>
            <div className="feature-list">
              <div className="feature">
                <h3>Exercise Tracking</h3>
                <p>Use advanced MediaPipe technology to track your exercises in real-time.</p>
              </div>
              <div className="feature">
                <h3>Performance Statistics</h3>
                <p>Receive detailed feedback on reps, accuracy, and consistency.</p>
              </div>
              <div className="feature">
                <h3>Personalized Feedback</h3>
                <p>Get AI-driven insights to refine your form and prevent injuries.</p>
              </div>
            </div>
          </section>
    
          {/* How It Works Section */}
          <section id="how-it-works" className="how-it-works">
            <h2>How It Works</h2>
            <ol>
              <li>Choose an exercise to perform.</li>
              <li>Allow access to your camera for real-time tracking.</li>
              <li>Receive instant feedback and insights to improve.</li>
            </ol>
          </section>
    
          {/* Contact Section */}
          <section id="contact" className="contact">
            <h2>Contact Us</h2>
            <p>Have questions or feedback? We'd love to hear from you!</p>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </section>
    
          {/* Footer Section */}
          <footer className="footer">
            <p>© 2024 Elevate Fitness AI. All rights reserved.</p>
          </footer>
        </div>
    );
};

export default HomePage;
