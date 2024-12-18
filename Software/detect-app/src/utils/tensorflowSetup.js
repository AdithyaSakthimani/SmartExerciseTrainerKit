import * as tf from '@tensorflow/tfjs';

export const setupTensorFlow = async () => {
  try {
    await tf.ready();
    await tf.setBackend('webgl');
  } catch (error) {
    throw new Error('Failed to initialize TensorFlow.js: ' + error);
  }
};
