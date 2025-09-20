// Mock services for testing
export const ProductService = {
  getProducts: jest.fn(() => Promise.resolve({
    success: true,
    data: []
  })),
  getProduct: jest.fn(() => Promise.resolve({
    success: true,
    data: {}
  }))
};

export const CartService = {
  getCart: jest.fn(() => Promise.resolve({
    success: true,
    data: { lines: [], total: { value: 0, formatted: '$0.00' } }
  })),
  updateQuantity: jest.fn(() => Promise.resolve({
    success: true,
    data: {}
  })),
  removeItem: jest.fn(() => Promise.resolve({
    success: true,
    data: {}
  }))
};

export const AuthService = {
  login: jest.fn(() => Promise.resolve({ success: true })),
  logout: jest.fn(() => Promise.resolve({ success: true })),
  register: jest.fn(() => Promise.resolve({ success: true })),
  getUser: jest.fn(() => Promise.resolve({ success: true, data: {} }))
};

export const CheckoutService = {
  processCheckout: jest.fn(() => Promise.resolve({ success: true })),
  validateShipping: jest.fn(() => Promise.resolve({ success: true }))
};

// Default export for convenience
export default {
  ProductService,
  CartService,
  AuthService,
  CheckoutService
};