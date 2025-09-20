import api from './api.js';

/**
 * Cart API Service
 * Handles all cart-related API calls
 */
export class CartService {
  /**
   * Get current cart contents
   * @returns {Promise} API response
   */
  static async getCart() {
    try {
      const response = await api.get('/cart');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cart',
        data: null,
      };
    }
  }

  /**
   * Add item to cart
   * @param {number} variantId - Product variant ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} API response
   */
  static async addToCart(variantId, quantity = 1) {
    try {
      const response = await api.post('/cart', {
        variant_id: variantId,
        quantity: quantity,
      });
      return {
        success: true,
        data: response.data,
        message: 'Item added to cart successfully',
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add item to cart',
        data: null,
      };
    }
  }

  /**
   * Update cart item quantity
   * @param {string} lineId - Cart line ID
   * @param {number} quantity - New quantity
   * @returns {Promise} API response
   */
  static async updateCartItem(lineId, quantity) {
    try {
      const response = await api.put(`/cart/${lineId}`, {
        quantity: quantity,
      });
      return {
        success: true,
        data: response.data,
        message: 'Cart updated successfully',
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update cart item',
        data: null,
      };
    }
  }

  /**
   * Remove item from cart
   * @param {string} lineId - Cart line ID
   * @returns {Promise} API response
   */
  static async removeFromCart(lineId) {
    try {
      const response = await api.delete(`/cart/${lineId}`);
      return {
        success: true,
        data: response.data,
        message: 'Item removed from cart',
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove item from cart',
        data: null,
      };
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise} API response
   */
  static async clearCart() {
    try {
      const response = await api.delete('/cart');
      return {
        success: true,
        data: response.data,
        message: 'Cart cleared successfully',
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to clear cart',
        data: null,
      };
    }
  }
}

export default CartService;