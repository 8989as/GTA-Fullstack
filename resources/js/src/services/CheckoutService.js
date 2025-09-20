import api from './api.js';

/**
 * Checkout API Service
 * Handles all checkout-related API calls
 */
export class CheckoutService {
  /**
   * Get checkout data
   * @returns {Promise} API response
   */
  static async getCheckout() {
    try {
      const response = await api.get('/checkout');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching checkout:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch checkout data',
        data: null,
      };
    }
  }

  /**
   * Set shipping address
   * @param {Object} address - Shipping address data
   * @returns {Promise} API response
   */
  static async setShippingAddress(address) {
    try {
      const response = await api.post('/checkout/shipping-address', address);
      return {
        success: true,
        data: response.data,
        message: 'Shipping address set successfully',
      };
    } catch (error) {
      console.error('Error setting shipping address:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set shipping address',
        validationErrors: error.validationErrors,
        data: null,
      };
    }
  }

  /**
   * Set billing address
   * @param {Object} address - Billing address data
   * @returns {Promise} API response
   */
  static async setBillingAddress(address) {
    try {
      const response = await api.post('/checkout/billing-address', address);
      return {
        success: true,
        data: response.data,
        message: 'Billing address set successfully',
      };
    } catch (error) {
      console.error('Error setting billing address:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set billing address',
        validationErrors: error.validationErrors,
        data: null,
      };
    }
  }

  /**
   * Set shipping option
   * @param {Object} option - Shipping option data
   * @returns {Promise} API response
   */
  static async setShippingOption(option) {
    try {
      const response = await api.post('/checkout/shipping-option', option);
      return {
        success: true,
        data: response.data,
        message: 'Shipping option selected successfully',
      };
    } catch (error) {
      console.error('Error setting shipping option:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set shipping option',
        data: null,
      };
    }
  }

  /**
   * Process payment and complete checkout
   * @param {Object} paymentData - Payment data
   * @returns {Promise} API response
   */
  static async processPayment(paymentData) {
    try {
      const response = await api.post('/checkout/payment', paymentData);
      return {
        success: true,
        data: response.data,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment failed',
        validationErrors: error.validationErrors,
        data: null,
      };
    }
  }
}

export default CheckoutService;