import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token && config.headers) {
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
    const skipRedirect = error.config?.skipAuthRedirect;
    
    // Handle 401 Unauthorized unless explicitly skipped
    if (error.response?.status === 401 && !skipRedirect) {
      // Clear auth data
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Return error with message
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

