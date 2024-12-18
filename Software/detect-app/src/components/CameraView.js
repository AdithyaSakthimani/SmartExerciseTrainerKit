import React from 'react';
import Webcam from 'react-webcam';
import './CameraStyle.css'; // Import the CSS file

const CameraView = ({ webcamRef, canvasRef }) => {
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        className="webcam"
        videoConstraints={videoConstraints}
        width={640}
        height={480}
        mirrored={true}
        screenshotFormat="image/jpeg"
      />
      <canvas
        ref={canvasRef}
        className="canvas"
      />
    </div>
  );
};

export default CameraView;
