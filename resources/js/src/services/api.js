import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  // In development with Vite dev server, use Laravel server directly
  if (import.meta.env.DEV && window.location.port === '5173') {
    return 'http://localhost:8000/api';
  }
  // In production or when served by Laravel, use relative path
  return '/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Important for Sanctum authentication
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // You might want to redirect to login or trigger a logout action
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      error.validationErrors = validationErrors;
    }

    return Promise.reject(error);
  }
);

// Initialize CSRF protection for Sanctum
export const initializeCSRF = async () => {
  try {
    const csrfURL = import.meta.env.DEV && window.location.port === '5173'
      ? 'http://localhost:8000/sanctum/csrf-cookie'
      : '/sanctum/csrf-cookie';

    await axios.get(csrfURL, { withCredentials: true });
  } catch (error) {
    console.warn('Failed to initialize CSRF token:', error);
  }
};

export default api;