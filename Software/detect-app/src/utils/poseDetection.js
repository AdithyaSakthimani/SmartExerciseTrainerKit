import * as poseDetection from '@tensorflow-models/pose-detection';
import { setupTensorFlow } from './tensorflowSetup';
import { calculateAngle } from './geometryUtils';
import { drawKeypoint, setupCanvas } from './drawingUtils';

export const initializeDetector = async () => {
  await setupTensorFlow();
  const model = poseDetection.SupportedModels.MoveNet;
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    enableSmoothing: true,
    modelUrl: undefined,
  };
  return await poseDetection.createDetector(model, detectorConfig);
};

export const drawPoseKeypoints = (
  ctx,
  keypoints,
  videoWidth,
  videoHeight
) => {
  setupCanvas(ctx, videoWidth, videoHeight);
  keypoints.forEach(keypoint => drawKeypoint(ctx, keypoint));

  // Draw lines connecting arm keypoints
  const pairs = [
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist']
  ];

  pairs.forEach(([start, end]) => {
    const startPoint = keypoints.find(k => k.name === start);
    const endPoint = keypoints.find(k => k.name === end);

    if (startPoint?.score && endPoint?.score &&
        startPoint.score > 0.3 && endPoint.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
};

export const detectBicepCurl = (
  keypoints,
  isCurlPosition
) => {
  // Check both arms for bicep curl movement
  const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
  const leftElbow = keypoints.find(k => k.name === 'left_elbow');
  const leftWrist = keypoints.find(k => k.name === 'left_wrist');
  
  const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');
  const rightElbow = keypoints.find(k => k.name === 'right_elbow');
  const rightWrist = keypoints.find(k => k.name === 'right_wrist');
  
  // Function to check if keypoints are visible
  const isVisible = (point) => 
    point?.score && point.score > 0.3;

  // Check if either arm has valid keypoints
  const leftArmValid = isVisible(leftShoulder) && isVisible(leftElbow) && isVisible(leftWrist);
  const rightArmValid = isVisible(rightShoulder) && isVisible(rightElbow) && isVisible(rightWrist);

  if (!leftArmValid && !rightArmValid) {
    return { isCurlPosition, shouldCount: false };
  }

  // Calculate angles for both arms
  let leftAngle = 180;
  let rightAngle = 180;

  if (leftArmValid && leftShoulder && leftElbow && leftWrist) {
    leftAngle = calculateAngle(
      { x: leftShoulder.x, y: leftShoulder.y },
      { x: leftElbow.x, y: leftElbow.y },
      { x: leftWrist.x, y: leftWrist.y }
    );
  }

  if (rightArmValid && rightShoulder && rightElbow && rightWrist) {
    rightAngle = calculateAngle(
      { x: rightShoulder.x, y: rightShoulder.y },
      { x: rightElbow.x, y: rightElbow.y },
      { x: rightWrist.x, y: rightWrist.y }
    );
  }

  // Use the minimum angle between both arms
  const minAngle = Math.min(leftAngle, rightAngle);
  
  // Bicep curl is detected when angle is less than 70 degrees (arm bent)
  if (minAngle < 70 && !isCurlPosition) {
    return { isCurlPosition: true, shouldCount: false };
  } 
  
  // Count when returning to starting position (angle > 150 degrees)
  if (minAngle > 150 && isCurlPosition) {
    return { isCurlPosition: false, shouldCount: true };
  }

  return { isCurlPosition, shouldCount: false };
};
