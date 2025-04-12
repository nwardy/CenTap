// Base URL for the API
const API_BASE_URL = 'https://api.your-attendance-app.com';

// Helper function for making API requests
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // In a real application, you would include authentication headers
      // 'Authorization': `Bearer ${getAuthToken()}`
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// API endpoints
export const api = {
  // Attendees
  getAttendees: () => fetchApi('/attendees'),
  getAttendee: (id) => fetchApi(`/attendees/${id}`),
  checkInAttendee: (nfcTagId) => fetchApi('/attendance/check-in', {
    method: 'POST',
    body: JSON.stringify({ nfcTagId })
  }),
  
  // Reports
  getDailyReport: (date) => fetchApi(`/reports/daily?date=${date}`),
  getWeeklyReport: (startDate) => fetchApi(`/reports/weekly?startDate=${startDate}`),
  getMonthlyReport: (month, year) => fetchApi(`/reports/monthly?month=${month}&year=${year}`),
  
  // Settings
  getSettings: () => fetchApi('/settings'),
  updateSettings: (settings) => fetchApi('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
};