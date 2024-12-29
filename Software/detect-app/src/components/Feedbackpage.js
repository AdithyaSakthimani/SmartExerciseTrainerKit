import React, { useContext, useEffect, useState } from 'react';
import NoteContext from './NoteContext';
import axios from 'axios';
import './feedbackstyle.css'; // Import the external CSS file

function FeedbackPage() {
  const [summary, setSummary] = useState([]); // Expecting an array of summaries
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { globalUsername } = useContext(NoteContext);

  // Fetch the summary from the server
  const fetchSummary = () => {
    setLoading(true);
    setError(null); // Reset error state before new request

    axios
      .post('http://localhost:8001/Summary', {
        username: globalUsername,
      })
      .then((response) => {
        console.log('Summary fetched:', response.data);
        setSummary(response.data); 
        setLoading(false); // Stop loading after success
      })
      .catch((error) => {
        console.error('Error fetching summary:', error);
        setError(error.response?.data?.message || 'An error occurred');
        setLoading(false); // Stop loading after failure
      });
  };

  useEffect(() => {
    if (globalUsername) {
      fetchSummary(); 
    }
  }, [globalUsername]);

  return (
    <div className="feedback-container">
      <h1 className="feedback-header">Workout Summary for {globalUsername}</h1>
      <button className="new-feedback-button" onClick={fetchSummary}>
        Refresh Summaries
      </button>

      {loading && <p className="feedback-loading">Loading...</p>}
      {error && <p className="feedback-error">Error: {error}</p>}
      {!loading && !error && summary.length > 0 ? (
        summary.map((obj, ind) => (
          <div key={ind} className="feedback-card">
            <h2 className="feedback-card-title">Workout {ind + 1}</h2>
            <p>
              <strong>Bicep Curls:</strong> {obj.BicepCurlCnt}
            </p>
            <p>
              <strong>Push-Ups:</strong> {obj.PushUpCnt}
            </p>
            <p>
              <strong>Squats:</strong> {obj.SquatCnt}
            </p>
            <p>
              <strong>Plank Time :</strong> {obj.PlankTime}
            </p>
            <p>
              <strong>Jumping Jacks :</strong> {obj.JumpingJackCnt}

            </p>
          </div>
        ))
      ) : (
        !loading && <p className="feedback-message">No workout summaries available.</p>
      )}
    </div>
  );
}

export default FeedbackPage;
