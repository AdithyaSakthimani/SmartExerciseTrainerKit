import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const APP = () => {
  const [isVideoRunning, setIsVideoRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [username, setUsername] = useState('testUser'); // Replace with dynamic username logic

  const startVideo = async () => {
    setIsVideoRunning(true);
    setStatusMessage('🎥 Starting video feed...');
    try {
      const response = await fetch('http://localhost:5000/start_video', {
        method: 'POST',
      });

      if (response.ok) {
        setStatusMessage('✅ Video feed started.');
      } else {
        setStatusMessage('❌ Failed to start video feed.');
      }
    } catch (error) {
      console.error('Error starting video feed:', error);
    }
  };

  const stopVideo = async () => {
    setIsVideoRunning(false);
    setStatusMessage('📴 Stopping video feed...');
    try {
      const response = await fetch('http://localhost:5000/stop_video', {
        method: 'POST',
      });

      if (response.ok) {
        setStatusMessage('✅ Video feed stopped.');
      } else {
        setStatusMessage('❌ Failed to stop video feed.');
      }
    } catch (error) {
      console.error('Error stopping video feed or fetching summary:', error);
    }
  };

  return (
    <div className="main-file">
      <div className="App">
        <h2 className="header-txt">🏋️ Start Your Workout</h2>

        {/* Streamlit App embedded here */}
        {isVideoRunning && (
          <div className="iframe-container">
            <iframe
              src="http://localhost:8501"
              title="Streamlit Fitness Tracker"
              width="100%"
              height="500px"
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </div>
        )}

        {/* Control Buttons */}
        <div className="button-container">
          <button
            onClick={startVideo}
            disabled={isVideoRunning}
            className="start-button"
          >
            🚀 Start Video Feed
          </button>
          <button
            onClick={stopVideo}
            disabled={!isVideoRunning}
            className="end-button"
          >
            ⛔ Stop Video Feed
          </button>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h3>💡 About the Fitness Tracker</h3>
          <ul>
            <li>AI tracks and counts your exercise repetitions in real-time. 🤖</li>
            <li>Supports exercises like Squats, Push-ups, and Bicep Curls. 💪</li>
            <li>Uses computer vision for instant workout feedback. 🏃‍♂️</li>
            <li>Built with React, Flask, and MediaPipe for seamless tracking. 🌐</li>
          </ul>
        </div>

        {/* Feedback and Goals */}
        <div className="feedback-area">
          <Link to="/Goals">
            <button className="setgoal-button">🎯 Set Your Workout Goals</button>
          </Link>
          <Link to="/Summary">
            <button className="feedback-button">📊 Get Your Workout Summary</button>
          </Link>
          <Link to="/SensorData">
            <button className="feedback-button">📊 Sensor Data</button>
          </Link>
        </div>

        {/* Status Message */}
        {statusMessage && <p className="status-msg">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default APP;
