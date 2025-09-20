import api from './api.js';

/**
 * Product API Service
 * Handles all product-related API calls
 */
export class ProductService {
  /**
   * Fetch products with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.brand - Brand filter
   * @param {string} params.model - Model filter
   * @param {string} params.year - Year filter
   * @param {string} params.part_type - Part type filter
   * @param {number} params.price_min - Minimum price
   * @param {number} params.price_max - Maximum price
   * @returns {Promise} API response
   */
  static async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
        data: [],
        pagination: null,
      };
    }
  }

  /**
   * Search products by query
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  static async searchProducts(query, params = {}) {
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...params }
      });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search products',
        data: [],
        pagination: null,
      };
    }
  }

  /**
   * Get single product by slug
   * @param {string} slug - Product slug
   * @returns {Promise} API response
   */
  static async getProduct(slug) {
    try {
      const response = await api.get(`/products/${slug}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Product not found',
        data: null,
      };
    }
  }

  /**
   * Get products by collection
   * @param {string} collectionSlug - Collection slug
   * @returns {Promise} API response
   */
  static async getProductsByCollection(collectionSlug) {
    try {
      const response = await api.get(`/collections/${collectionSlug}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching collection products:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Collection not found',
        data: null,
      };
    }
  }
}

export default ProductService;