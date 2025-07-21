import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If we're already on the login page, don't try to refresh
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }
      
      try {
        // Try to get a new token by logging in again
        // This requires the user to have their credentials stored securely
        // For a production app, you'd want to implement a proper refresh token flow
        
        // For now, just redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
        
      } catch (error) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
