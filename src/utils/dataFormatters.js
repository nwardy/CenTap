// Format time to a readable string
export const formatTime = (date) => {
    if (!date) return '-';
    
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format date to a readable string
  export const formatDate = (date) => {
    if (!date) return '-';
    
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format percentage
  export const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };
  
  // Format attendance status
  export const formatStatus = (isPresent) => {
    return isPresent ? 'Present' : 'Absent';
  };
  
  // Generate file name for exports
  export const generateFileName = (prefix, extension) => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    return `${prefix}-${dateString}.${extension}`;
  };