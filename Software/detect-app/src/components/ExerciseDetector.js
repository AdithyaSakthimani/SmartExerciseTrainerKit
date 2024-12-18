import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { initializeDetector, drawPoseKeypoints, detectBicepCurl } from '../utils/poseDetection';
import CameraView from './CameraView';
import ExerciseCounter from './ExerciseCounter';
import Instructions from './Instructions';
import './ExerciseDetection.css'; // Import the CSS file

const ExerciseDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [detector, setDetector] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [isCurlPosition, setIsCurlPosition] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const detector = await initializeDetector();
        setDetector(detector);
      } catch (err) {
        setError('Failed to initialize pose detector. Please make sure your browser supports WebGL.');
        console.error('Detector initialization error:', err);
      }
    };
    init();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const detectPose = useCallback(async () => {
    if (!detector || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    try {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      const poses = await detector.estimatePoses(video, {
        flipHorizontal: false
      });
      
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        const ctx = canvasRef.current.getContext('2d');
        
        if (ctx) {
          drawPoseKeypoints(ctx, keypoints, videoWidth, videoHeight);
          
          const { isCurlPosition: newCurlPosition, shouldCount } = detectBicepCurl(
            keypoints,
            isCurlPosition
          );
          
          if (shouldCount) {
            setExerciseCount(prev => prev + 1);
          }
          
          setIsCurlPosition(newCurlPosition);
        }
      }

      if (isDetecting) {
        requestRef.current = requestAnimationFrame(detectPose);
      }
    } catch (err) {
      console.error('Pose detection error:', err);
      setError('Error during pose detection. Please refresh the page.');
    }
  }, [detector, isDetecting, isCurlPosition]);

  useEffect(() => {
    if (isDetecting) {
      detectPose();
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, [isDetecting, detectPose]);

  const toggleDetection = () => {
    setIsDetecting(prev => !prev);
  };

  const resetCount = () => {
    setExerciseCount(0);
  };

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="exercise-detector">
      <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />
      <ExerciseCounter
        count={exerciseCount}
        isDetecting={isDetecting}
        onToggleDetection={toggleDetection}
        onReset={resetCount}
      />
      <Instructions />
    </div>
  );
};

export default ExerciseDetector;
