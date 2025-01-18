import React, { useContext,useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Add your CSS styles here
import NoteContext from './NoteContext';


const HomePage = () => { 
  const [result, setResult] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    setShowAlert(true);

    const formData = new FormData(event.target);
    formData.append("access_key", "4031c5fa-649a-4285-9b8b-9859937c04d5");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully!");
        event.target.reset();
      } else {
        setResult(data.message || "Failed to submit the form.");
      }
    } catch (error) {
      setResult("An error occurred. Please try again.");
      console.error("Submission error:", error);
    }

    // Hide the alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

    return (
        <div className="app-container">
          {/* Hero Section */}
          <section className="hero">
            <h1>Track, Improve, Elevate</h1>
            <p>Your AI-powered fitness companion to help you acheive your fitness dreams</p>
            <Link to='/tracker'>
            <button className="cta-button">Get Started</button>
            </Link>
          </section>
    
          {/* Features Section */}
          <section id="features" className="features">
  <h2 className="feature-hed">Features</h2>
  <div className="feature-list">
    <div className="feature">
      <h3>Workout Tracking</h3>
      <p>Track your workout reps automatically with precision and accuracy.</p>
    </div>
    <div className="feature">
      <h3>Detailed Summaries</h3>
      <p>View comprehensive summaries of your workouts, including total reps and performance analysis.</p>
    </div>
    <div className="feature">
      <h3>Real-Time Sensor Integration</h3>
      <p>Monitor real-time sensor readings for metrics like heart rate, motion, and more using integrated sensors.</p>
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
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <form className="contact-form" onSubmit={onSubmit}>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
     {/* Alert Box */}
     {showAlert && (
        <div className="alert-box">
          {result}
        </div>
      )}

          {/* Footer Section */}
          <footer className="footer">
            <p>© 2024 Elevate Fitness AI. All rights reserved.</p>
          </footer>
        </div>
    );
};

export default HomePage;
