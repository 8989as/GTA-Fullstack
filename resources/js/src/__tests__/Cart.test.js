import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Cart from '../Pages/Cart';
import { validateQuantity, validateCart } from '../utils/cartValidation';

// Mock the validation utilities
jest.mock('../utils/cartValidation', () => ({
  validateQuantity: jest.fn(),
  validateCart: jest.fn(),
  debounce: jest.fn((fn) => fn)
}));

// Mock the services
jest.mock('../services', () => require('../__mocks__/services'));

// Mock the context hooks
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn()
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../context/LanguageContext', () => ({
  useLanguage: jest.fn()
}));

// Import the mocked functions
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const mockUseCart = useCart;
const mockUseAuth = useAuth;
const mockUseLanguage = useLanguage;

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: '' };



// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

// Test data helpers
const createTestCart = (overrides = {}) => ({
  lines: [
    {
      id: 1,
      product: {
        id: 1,
        name: 'Test Product',
        thumbnail: 'test-image.jpg',
        stock: 10
      },
      quantity: 2,
      unit_price: { value: 100, formatted: '$100.00' },
      total: { value: 200, formatted: '$200.00' }
    }
  ],
  total: { value: 200, formatted: '$200.00' },
  sub_total: { value: 200, formatted: '$200.00' },
  tax_total: { value: 0, formatted: '$0.00' },
  ...overrides
});

describe('Cart Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    validateQuantity.mockClear();
    validateCart.mockClear();

    // Set up default validation mocks
    validateQuantity.mockReturnValue({ isValid: true, errors: [] });
    validateCart.mockReturnValue({ isValid: true, errors: [], warnings: [] });

    // Set up default mock context values
    mockUseCart.mockReturnValue({
      cart: { lines: [], total: { value: 0, formatted: '$0.00' } },
      loading: false,
      error: null,
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      addItem: jest.fn(),
      clearCart: jest.fn(),
      refreshCart: jest.fn(),
      clearMessage: jest.fn(),
      getCartItemsCount: jest.fn(() => 0),
      getFormattedCartTotal: jest.fn(() => '$0.00'),
    });

    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
      isAuthenticated: false,
    });

    mockUseLanguage.mockReturnValue({
      language: 'en',
      setLanguage: jest.fn(),
      isRTL: false,
    });
  });

  test('renders cart with items', async () => {
    const testCart = createTestCart();

    // Mock the cart context to return the test cart
    mockUseCart.mockReturnValue({
      cart: testCart,
      loading: false,
      error: null,
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      addItem: jest.fn(),
      clearCart: jest.fn(),
      refreshCart: jest.fn(),
      clearMessage: jest.fn(),
      getCartItemsCount: jest.fn(() => 2),
      getFormattedCartTotal: jest.fn(() => '$200.00'),
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  test('renders empty cart message when no items', async () => {
    const emptyCart = { lines: [], total: { value: 0, formatted: '$0.00' } };

    // Mock the cart context to return empty cart
    mockUseCart.mockReturnValue({
      cart: emptyCart,
      loading: false,
      error: null,
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      addItem: jest.fn(),
      clearCart: jest.fn(),
      refreshCart: jest.fn(),
      clearMessage: jest.fn(),
      getCartItemsCount: jest.fn(() => 0),
      getFormattedCartTotal: jest.fn(() => '$0.00'),
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });

  test('handles quantity update successfully', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cart: mockCart })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cart: {
            ...mockCart,
            lines: [{
              ...mockCart.lines[0],
              quantity: 3,
              total: { value: 300, formatted: '$300.00' }
            }]
          }
        })
      });

    validateQuantity.mockReturnValue({ isValid: true, errors: [] });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const increaseButton = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart/1', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 3 })
      }));
    });
  });

  test('handles quantity validation errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateQuantity.mockReturnValue({
      isValid: false,
      errors: ['Quantity exceeds available stock']
    });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const increaseButton = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(increaseButton);

    // Should not make API call when validation fails
    expect(fetch).toHaveBeenCalledTimes(1); // Only initial cart load
  });

  test('handles stock error from API', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cart: mockCart })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Insufficient stock available',
          errors: { stock: ['Only 5 items available'] }
        })
      });

    validateQuantity.mockReturnValue({ isValid: true, errors: [] });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const increaseButton = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(screen.getByText('Only 5 items available')).toBeInTheDocument();
    });
  });

  test('removes item from cart', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cart: mockCart })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cart: { lines: [], total: { value: 0, formatted: '$0.00' } } })
      });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart/1', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });

  test('validates cart before checkout', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateCart.mockReturnValue({
      isValid: false,
      errors: ['Cart validation failed'],
      warnings: []
    });

    // Mock window.alert
    window.alert = jest.fn();

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Please fix the following issues')
    );
  });

  test('handles checkout with warnings', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateCart.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: ['Some items may have limited availability']
    });

    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    localStorageMock.getItem.mockReturnValue('mock-token');

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Some items may have limited availability')
    );
  });

  test('redirects to login when not authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateCart.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: []
    });

    localStorageMock.getItem.mockReturnValue(null); // No token

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    expect(window.location.href).toBe('/login');
  });

  test('displays validation errors in UI', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateCart.mockReturnValue({
      isValid: false,
      errors: ['Invalid quantity for some items'],
      warnings: []
    });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Invalid quantity for some items')).toBeInTheDocument();
    });
  });

  test('displays validation warnings in UI', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cart: mockCart })
    });

    validateCart.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: ['Some items may be out of stock soon']
    });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Some items may be out of stock soon')).toBeInTheDocument();
    });
  });

  test('shows optimistic updates during quantity changes', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cart: mockCart })
      })
      .mockImplementationOnce(() => new Promise(resolve => {
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ cart: mockCart })
        }), 100);
      }));

    validateQuantity.mockReturnValue({ isValid: true, errors: [] });

    render(
      <CartWrapper>
        <Cart />
      </CartWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const increaseButton = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(increaseButton);

    // Should show optimistic update (quantity 3) immediately
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});