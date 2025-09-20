// Re-export all services for easy importing
export { default as api } from './api.js';
export { ProductService } from './ProductService.js';
export { CartService } from './CartService.js';
export { AuthService } from './AuthService.js';
export { CheckoutService } from './CheckoutService.js';
export { OrderService } from './OrderService.js';

// Default export for convenience
export default {
  ProductService,
  CartService,
  AuthService,
  CheckoutService,
  OrderService,
};