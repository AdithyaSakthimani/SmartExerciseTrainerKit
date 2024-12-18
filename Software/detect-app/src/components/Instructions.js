import React from 'react';
import './Instructions.css'; // Import the CSS file

const Instructions = () => {
  return (
    <div className="instructions">
      <h3>Instructions for Bicep Curls:</h3>
      <ul>
        <li>Stand facing the camera with your full upper body visible</li>
        <li>Keep your upper arms still, close to your body</li>
        <li>Start with your arms fully extended</li>
        <li>Curl your arms up until your forearms are vertical</li>
        <li>Lower your arms back to the starting position</li>
        <li>The counter will increment for each complete curl</li>
        <li>You can perform curls with either arm or both arms together</li>
      </ul>
    </div>
  );
};

export default Instructions;
