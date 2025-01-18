import React, { useContext, useEffect, useState } from 'react';
import NoteContext from './NoteContext';
import axios from 'axios';
import './feedbackstyle.css';

function FeedbackPage() {
  const [summary, setSummary] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { globalUsername } = useContext(NoteContext);

  // Fetch both exercise summary and sensor data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch exercise summary
      const summaryResponse = await axios.post('http://localhost:8001/Summary', {
        username: globalUsername,
      });
      setSummary(summaryResponse.data);

      // Fetch sensor data
      const sensorResponse = await axios.post('http://localhost:8001/getSensorSummary', {
        username: globalUsername,
      });
      setSensorData(sensorResponse.data.sensorData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (globalUsername) {
      fetchData();
    }
  }, [globalUsername]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-header">Workout Summary for {globalUsername}</h1>
      <button className="new-feedback-button" onClick={fetchData}>
        Refresh Data
      </button>

      {loading && <p className="feedback-loading">Loading...</p>}
      {error && <p className="feedback-error">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="summary-grid">
          <div className="exercise-summary">
            <h2>Exercise Summary</h2>
            {summary.length > 0 ? (
              summary.map((obj, ind) => {
                const formattedDate = new Date(obj.timestamp).toISOString().split("T")[0];
                return (
                  <div key={ind} className="feedback-card">
                    <h3 className="feedback-card-title">Workout {ind + 1}</h3>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Bicep Curls:</strong> {obj.BicepCurlCnt}</p>
                    <p><strong>Push-Ups:</strong> {obj.PushUpCnt}</p>
                    <p><strong>Crunches:</strong> {obj.SquatCnt}</p>
                    <p><strong>Plank Time:</strong> {obj.CrunchCnt}</p>
                    <p><strong>Jumping Jacks:</strong> {obj.JumpingJackCnt}</p>
                  </div>
                );
              })
            ) : (
              <p className="feedback-message">No exercise summaries available.</p>
            )}
          </div>

          <div className="sensor-summary">
            <h2>Sensor Data Summary</h2>
            {sensorData.length > 0 ? (
              sensorData.map((data, index) => (
                <div key={index} className="feedback-card">
                  <h3 className="feedback-card-title">Session {index + 1}</h3>
                  <p><strong>Duration:</strong> {formatTime(data.duration)}</p>
                  <p><strong>Temperature:</strong> {data.temperature.toFixed(1)}°C</p>
                  <p><strong>Calories Burned:</strong> {data.caloriesBurned}</p>
                  <p><strong>Average Heart Rate:</strong> {data.averageHeartBeat} BPM</p>
                </div>
              ))
            ) : (
              <p className="feedback-message">No sensor data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;