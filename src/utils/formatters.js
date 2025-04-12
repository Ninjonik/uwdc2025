export function formatTimeDifference(startTime) {
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const now = new Date();
  const diffInSeconds = Math.floor((now - start) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
}

export function formatReactionTime(milliseconds) {
  // Handle invalid input
  if (isNaN(milliseconds) || milliseconds === null || milliseconds === undefined) {
    return '-';
  }
  
  // Convert to seconds for easier calculation
  const totalSeconds = milliseconds / 1000;
  
  // If less than 60 seconds, return seconds with one decimal place
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  // Format as "Xm Ys"
  return `${minutes}m ${seconds}s`;
}
