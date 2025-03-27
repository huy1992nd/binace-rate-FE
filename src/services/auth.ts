import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
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

// Add response interceptor to handle token validation
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedPairs');
      window.location.reload(); // Reload the page to trigger logout
    }
    return Promise.reject(error);
  }
);

export const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('selectedPairs');
  window.location.reload();
};

export default axiosInstance; 