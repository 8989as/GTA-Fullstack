import api from './api.js';

/**
 * Order API Service
 * Handles all order-related API calls
 */
export class OrderService {
  /**
   * Get user's orders with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.status - Order status filter
   * @returns {Promise} API response
   */
  static async getOrders(params = {}) {
    try {
      const response = await api.get('/orders', { params });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
        data: [],
        pagination: null,
      };
    }
  }

  /**
   * Get single order by ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise} API response
   */
  static async getOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Order not found',
        data: null,
      };
    }
  }

  /**
   * Cancel an order
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} API response
   */
  static async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, { reason });
      return {
        success: true,
        data: response.data,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel order',
        data: null,
      };
    }
  }

  /**
   * Reorder items from a previous order
   * @param {string|number} orderId - Order ID to reorder
   * @returns {Promise} API response
   */
  static async reorder(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return {
        success: true,
        data: response.data,
        message: 'Items added to cart successfully',
      };
    } catch (error) {
      console.error('Error reordering:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reorder items',
        data: null,
      };
    }
  }

  /**
   * Track order status
   * @param {string|number} orderId - Order ID
   * @returns {Promise} API response
   */
  static async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error tracking order:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to track order',
        data: null,
      };
    }
  }

  /**
   * Get order invoice
   * @param {string|number} orderId - Order ID
   * @returns {Promise} API response
   */
  static async getOrderInvoice(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob', // For PDF download
      });
      return {
        success: true,
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch invoice',
        data: null,
      };
    }
  }

  /**
   * Submit order review/rating
   * @param {string|number} orderId - Order ID
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise} API response
   */
  static async submitOrderReview(orderId, reviewData) {
    try {
      const response = await api.post(`/orders/${orderId}/review`, reviewData);
      return {
        success: true,
        data: response.data,
        message: 'Review submitted successfully',
      };
    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit review',
        validationErrors: error.validationErrors,
        data: null,
      };
    }
  }

  /**
   * Get order statuses for filtering
   * @returns {Promise} API response
   */
  static async getOrderStatuses() {
    try {
      const response = await api.get('/orders/statuses');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching order statuses:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order statuses',
        data: [],
      };
    }
  }
}

export default OrderService;