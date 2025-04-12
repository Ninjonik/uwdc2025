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

export function formatReactionTime(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
    return '-';
  }

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  // Format as "Xm Ys"
  return `${minutes}m ${seconds}s`;
}
