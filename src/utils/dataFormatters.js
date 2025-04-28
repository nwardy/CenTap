export const formatTime = (date) => {
    if (!date) return '-';
    
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
export const formatDate = (date) => {
    if (!date) return '-';
    
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
export const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };
  
export const formatStatus = (isPresent) => {
    return isPresent ? 'Present' : 'Absent';
  };
  
export const generateFileName = (prefix, extension) => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    return `${prefix}-${dateString}.${extension}`;
  };