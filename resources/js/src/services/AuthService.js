import api from './api.js';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.password_confirmation - Password confirmation
   * @returns {Promise} API response
   */
  static async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store authentication data
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return {
        success: true,
        data: { token, user },
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        validationErrors: error.validationErrors,
      };
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise} API response
   */
  static async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store authentication data
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return {
        success: true,
        data: { token, user },
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        validationErrors: error.validationErrors,
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise} API response
   */
  static async logout() {
    try {
      await api.post('/auth/logout');
      
      // Clear stored authentication data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed',
      };
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise} API response
   */
  static async getCurrentUser() {
    try {
      const response = await api.get('/auth/user');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user data',
      };
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored auth token
   * @returns {string|null} Auth token
   */
  static getStoredToken() {
    return localStorage.getItem('auth_token');
  }
}

export default AuthService;