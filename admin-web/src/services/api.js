import axios from 'axios';
import { BASE_URL } from '../config/api.config';
import { getFromStorage, STORAGE_KEYS } from '../utils/helpers';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getFromStorage(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized - Please login again');
          // Clear storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - You do not have permission');
          break;
        case 404:
          console.error('Not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', data?.message || error.message);
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || data?.title || error.message,
        data: data
      });
    } else if (error.request) {
      // Network error
      console.error('Network error - Please check your connection');
      return Promise.reject({
        status: 0,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        data: null
      });
    } else {
      // Other errors
      console.error('Error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message,
        data: null
      });
    }
  }
);

export default api;
