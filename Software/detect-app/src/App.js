import React, { useState, useEffect, useRef, useContext } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NoteContext from './components/NoteContext';

const APP = () => {
  const [isVideoRunning, setIsVideoRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [temp, setCurrentTemp] = useState(0);
  const [weatherUpdate, setWeatherUpdate] = useState('Start Your Sensor');
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRateData, setHeartRateData] = useState([]); // New state for heart rate data
  const { globalUsername } = useContext(NoteContext);
  const heartRateReadings = useRef([]);

  const WEATHER_RECOMMENDATIONS = {
    hot: { threshold: 30, message: '🌡️ High temperature detected! Stay hydrated and take breaks.' },
    warm: { threshold: 25, message: '☀️ Warm conditions. Stay hydrated!' },
    moderate: { threshold: 20, message: '✨ Ideal temperature for workouts!' },
    cool: { threshold: 15, message: '❄️ Cool conditions. Warm-up well!' },
    cold: { threshold: 10, message: 'Connect your sensor properly.' },
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getWeatherUpdate = (temperature) => {
    if (temperature >= WEATHER_RECOMMENDATIONS.hot.threshold) {
      return WEATHER_RECOMMENDATIONS.hot.message;
    } else if (temperature >= WEATHER_RECOMMENDATIONS.warm.threshold) {
      return WEATHER_RECOMMENDATIONS.warm.message;
    } else if (temperature >= WEATHER_RECOMMENDATIONS.moderate.threshold) {
      return WEATHER_RECOMMENDATIONS.moderate.message;
    } else if (temperature >= WEATHER_RECOMMENDATIONS.cool.threshold) {
      return WEATHER_RECOMMENDATIONS.cool.message;
    } else {
      return WEATHER_RECOMMENDATIONS.cold.message;
    }
  };

  const calculateAverages = (data) => {
    const lines = data.trim().split('\r\n');
    let totalHR = 0;
    let totalSpO2 = 0;
    let count = 0;

    for (const line of lines) {
      const hrMatch = line.match(/HR:\s([\d.]+)/);
      const spo2Match = line.match(/SpO2:\s([\d.]+)/);

      if (hrMatch && spo2Match) {
        const hr = parseFloat(hrMatch[1]);
        const spo2 = parseFloat(spo2Match[1]);

        if (hr > 200 || hr < 30) continue; // Filter out unrealistic HR values

        totalHR += hr;
        totalSpO2 += spo2;
        count++;
      }
    }

    return {
      averageHR: count > 0 ? Math.floor(totalHR / count) : 0,
      averageSpO2: count > 0 ? parseFloat((totalSpO2 / count).toFixed(2)) : 0,
    };
  };

  const calculateCalories = (avgHeartRate, durationInSeconds) => {
    const MET = avgHeartRate / 100;
    const weight = 70;
    const durationInHours = durationInSeconds / 3600;
    return Math.round(MET * weight * durationInHours * 5);
  };

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:8001/getsensordata');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sensor data');
      }

      const sensorData = await response.json();
      console.log('Received sensor data:', sensorData); // Debug log
      
      const { temperature, NodemCuData } = sensorData;
      
      setCurrentTemp(temperature);
      setWeatherUpdate(getWeatherUpdate(temperature));

      if (NodemCuData && isVideoRunning) {
        const averages = calculateAverages(NodemCuData);
        console.log('Calculated averages:', averages); // Debug log

        if (averages.averageHR > 0) {
          heartRateReadings.current.push(averages.averageHR);
          setHeartRateData(prev => [...prev, averages.averageHR]);
          console.log('Heart rate readings updated:', heartRateReadings.current); // Debug log

          const totalHR = heartRateReadings.current.reduce((sum, hr) => sum + hr, 0);
          const countHR = heartRateReadings.current.length;
          const avgHR = Math.floor(totalHR / countHR);

          const duration = Math.floor((Date.now() - startTime) / 1000);
          const currentCalories = calculateCalories(avgHR, duration);

          setCalories(currentCalories);
        }
      }
    } catch (error) {
      setStatusMessage('❌ Error fetching sensor data.');
      console.error('Sensor data fetch error:', error);
    }
  };

  const sendServerData = async () => {
    try {
      console.log('Heart rate readings before sending:', heartRateReadings.current); // Debug log
      
      const avgHr = heartRateData.length > 0 
        ? Math.floor(heartRateData.reduce((sum, hr) => sum + hr, 0) / heartRateData.length) 
        : 0;
      
      console.log('Calculated average heart rate:', avgHr); // Debug log
      
      const sensorData = {
        username: globalUsername,
        duration: elapsedTime,
        temperature: temp,
        caloriesBurned: calories,
        averageHeartBeat: avgHr,
      };

      console.log('Sending sensor data:', sensorData); // Debug log
      
      const res = await axios.post('http://localhost:8001/sendSensorData', sensorData);
      console.log('Server response:', res.data); // Debug log
    } catch (error) {
      console.error('Error sending data:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, [exerciseStarted, isVideoRunning, startTime]);

  useEffect(() => {
    let interval;
    if (isVideoRunning) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setTotalTime((prevTime) => prevTime + elapsedTime);
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isVideoRunning, startTime]);

  // Debug effect for heart rate updates
  useEffect(() => {
    console.log('Heart rate data updated:', heartRateData);
  }, [heartRateData]);

  const startVideo = async () => {
    setIsVideoRunning(true);
    setExerciseStarted(true);
    setStartTime(Date.now());
    setHeartRateData([]); // Reset heart rate data
    heartRateReadings.current = []; // Reset heart rate readings
    setStatusMessage('🎥 Starting video feed...');

    try {
        // Start the video feed
        const videoResponse = await fetch('http://localhost:5000/start_video', { method: 'POST' });
        if (videoResponse.ok) {
            setStatusMessage('✅ Video feed started.');
        } else {
            setStatusMessage('❌ Failed to start video feed.');
        }

        // Send the username
        const userResponse = await axios.post('http://localhost:8001/sendUsername', {
            username: globalUsername,
        });
        console.log(userResponse.data); // Log the response data
    } catch (error) {
        setStatusMessage('❌ Error starting video feed.');
        console.error(error);
    }
};


  const stopVideo = async () => {
    await sendServerData();
    setIsVideoRunning(false);
    setExerciseStarted(false);
    setStartTime(null);
    setStatusMessage('📴 Stopping video feed...');
    try {
      const response = await fetch('http://localhost:5000/stop_video', { method: 'POST' });
      if (response.ok) {
        setStatusMessage('✅ Video feed stopped.');
      } else {
        setStatusMessage('❌ Failed to stop video feed.');
      }
    } catch (error) {
      setStatusMessage('❌ Error stopping video feed.');
      console.error(error);
    }
  };

  return (
    <div className="main-file">
      <div className="App">
        <h2 className="header-txt">
          {exerciseStarted ? '🏋️ Welcome To Your Exercise Window' : '🏋️ Start Your Workout'}
        </h2>

          <div className="timer">
            <p>⌚ Total Workout Duration: {formatTime(totalTime)}</p>
          </div>

        <div className="info-section">
          <p>🌡️ Temperature: {temp?.toFixed(1) || 'N/A'}°C</p>
          <p>🌤️ Weather Update: {weatherUpdate}</p>
          <p>😎 Calories Burned: {calories}</p>
          <p>❤️ Average Heart Rate: {
            heartRateData.length > 0 
              ? Math.floor(heartRateData.reduce((sum, hr) => sum + hr, 0) / heartRateData.length) 
              : 0
          } BPM</p>
          <p>⏱️ Time Elapsed: {formatTime(elapsedTime)}</p>
        </div>

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

        <div className="button-container">
          <button onClick={startVideo} disabled={isVideoRunning} className="start-button">
            🚀 Start Workout
          </button>
          <button onClick={stopVideo} disabled={!isVideoRunning} className="end-button">
            ⛔ End Workout
          </button>
        </div>

        {!isVideoRunning && (
          <div className="about-section">
            <h3>💡 About the Fitness Tracker</h3>
            <ul>
              <li>AI tracks and counts your exercise repetitions in real-time. 🤖</li>
              <li>Supports exercises like Pushups, Bicep Curls, and more. 💪</li>
              <li>Uses computer vision for instant workout feedback. 🏃‍♂️</li>
              <li>Real-time calorie tracking based on exercise intensity. 🔥</li>
            </ul>
          </div>
        )}

        <div className="feedback-area">
          <Link to="/Goals">
            <button className="setgoal-button">🎯 Set Your Workout Goals</button>
          </Link>
          <Link to="/Summary">
            <button className="feedback-button">📊 Get Your Workout Summary</button>
          </Link>
          <Link to="/SensorData">
            <button className="feedback-button">⚙️ Sensor Data</button>
          </Link>
        </div>

        {statusMessage && <p className="status-msg">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default APP;