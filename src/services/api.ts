import axios from 'axios';
import { STORAGE_KEYS, API_BASE_URL } from '../utils/constants';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Preserve status code in the error object
      const enhancedError = {
        ...error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
      };
      throw enhancedError;
    }
    throw error;
  }
);
