import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './WorkoutSensorData.css'; // Import the CSS file

// Register chart components
ChartJS.register(...registerables);

const WorkoutSensorData = () => {
  const [sensorData, setSensorData] = useState({
    temperature: [],
    accelX: [],
    accelY: [],
    accelZ: [],
    gyroX: [],
    gyroY: [],
    gyroZ: [],
    heartRate: [],
    spo2: [],
  });

  // Fetch sensor data from backend
  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:8001/getsensordata');
      if (response.ok) {
        const data = await response.json();
        console.log(data) ; 
        const timestamp = Date.now();
        setSensorData((prevData) => ({
          temperature: [...prevData.temperature, { x: timestamp, y: data.temperature }],
          accelX: [...prevData.accelX, { x: timestamp, y: data.accel_x }],
          accelY: [...prevData.accelY, { x: timestamp, y: data.accel_y }],
          accelZ: [...prevData.accelZ, { x: timestamp, y: data.accel_z }],
          gyroX: [...prevData.gyroX, { x: timestamp, y: data.gyro_x }],
          gyroY: [...prevData.gyroY, { x: timestamp, y: data.gyro_y }],
          gyroZ: [...prevData.gyroZ, { x: timestamp, y: data.gyro_z }],
          heartRate: [...prevData.heartRate, { x: timestamp, y: data.heart_rate }],
          spo2: [...prevData.spo2, { x: timestamp, y: data.spo2 }],
        }));
      } else {
        console.error('Failed to fetch sensor data');
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  // Fetch data every 2 seconds
  useEffect(() => {
    const interval = setInterval(fetchSensorData, 2000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const createChartData = (label, data) => ({
    labels: data.map((point) => point.x),
    datasets: [
      {
        label,
        data: data.map((point) => point.y),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  });

  return (
    <div className="workout-container">
      <h1>Real-Time Workout Sensor Data</h1>

      <h3>Temperature</h3>
      <Line data={createChartData('Temperature (°C)', sensorData.temperature)} />

      <h3>Accelerometer (X, Y, Z)</h3>
      <Line data={createChartData('Accel X', sensorData.accelX)} />
      <Line data={createChartData('Accel Y', sensorData.accelY)} />
      <Line data={createChartData('Accel Z', sensorData.accelZ)} />

      <h3>Gyroscope (X, Y, Z)</h3>
      <Line data={createChartData('Gyro X', sensorData.gyroX)} />
      <Line data={createChartData('Gyro Y', sensorData.gyroY)} />
      <Line data={createChartData('Gyro Z', sensorData.gyroZ)} />

      <h3>Heart Rate & SpO2</h3>
      <Line data={createChartData('Heart Rate', sensorData.heartRate)} />
      <Line data={createChartData('SpO2', sensorData.spo2)} />
    </div>
  );
};

export default WorkoutSensorData;
