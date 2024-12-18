import React from 'react';
import { Camera, RefreshCcw } from 'lucide-react';
import './ExerciseStyle.css'; // Import the CSS file

const ExerciseCounter = ({ count, isDetecting, onToggleDetection, onReset }) => {
  return (
    <div className="exercise-counter">
      <div className="count">
        Bicep Curls: {count}
      </div>
      
      <div className="button-container">
        <button
          onClick={onToggleDetection}
          className={`button ${isDetecting ? 'stop-button' : 'start-stop-button'}`}
        >
          <Camera className="w-5 h-5" />
          {isDetecting ? 'Stop Detection' : 'Start Detection'}
        </button>

        <button
          onClick={onReset}
          className="button reset-button"
        >
          <RefreshCcw className="w-5 h-5" />
          Reset Count
        </button>
      </div>
    </div>
  );
};

export default ExerciseCounter;
