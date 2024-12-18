export const drawKeypoint = (ctx, keypoint, color = '#00ff00') => {
  if (keypoint.score && keypoint.score > 0.3) {
    const { x, y } = keypoint;
    
    // Draw point
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw label
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(keypoint.name || '', x + 5, y + 5);
  }
};

export const setupCanvas = (ctx, width, height) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.canvas.width = width;
  ctx.canvas.height = height;
};
