import { validateQuantity, validateCart, validateShipping, debounce } from '../utils/cartValidation';

describe('Cart Validation Utilities', () => {
  describe('validateQuantity', () => {
    test('validates valid quantity', () => {
      const result = validateQuantity(5, 10, 1);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects negative quantity', () => {
      const result = validateQuantity(-1, 10, 1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be at least 1');
    });

    test('rejects zero quantity', () => {
      const result = validateQuantity(0, 10, 1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be at least 1');
    });

    test('rejects quantity exceeding stock', () => {
      const result = validateQuantity(15, 10, 1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only 10 items available in stock');
    });

    test('rejects quantity exceeding maximum allowed', () => {
      const result = validateQuantity(25, 100, 1, 20);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Maximum 20 items allowed per order');
    });

    test('handles edge case at stock limit', () => {
      const result = validateQuantity(10, 10, 1);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('handles edge case at maximum limit', () => {
      const result = validateQuantity(20, 100, 1, 20);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validates minimum quantity requirement', () => {
      const result = validateQuantity(2, 10, 3);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Minimum 3 items required');
    });

    test('handles multiple validation errors', () => {
      const result = validateQuantity(-5, 10, 1);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCart', () => {
    const validCart = {
      lines: [
        {
          id: 1,
          product: { id: 1, name: 'Product 1', stock: 10 },
          quantity: 2
        },
        {
          id: 2,
          product: { id: 2, name: 'Product 2', stock: 5 },
          quantity: 1
        }
      ],
      total: { value: 300 }
    };

    test('validates valid cart', () => {
      const result = validateCart(validCart);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects empty cart', () => {
      const emptyCart = { lines: [], total: { value: 0 } };
      const result = validateCart(emptyCart);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cart is empty');
    });

    test('rejects cart with invalid quantities', () => {
      const invalidCart = {
        ...validCart,
        lines: [
          {
            id: 1,
            product: { id: 1, name: 'Product 1', stock: 10 },
            quantity: 0
          }
        ]
      };
      const result = validateCart(invalidCart);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('invalid quantity'))).toBe(true);
    });

    test('rejects cart exceeding stock limits', () => {
      const stockExceededCart = {
        ...validCart,
        lines: [
          {
            id: 1,
            product: { id: 1, name: 'Product 1', stock: 2 },
            quantity: 5
          }
        ]
      };
      const result = validateCart(stockExceededCart);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('exceeds available stock'))).toBe(true);
    });

    test('warns about low stock items', () => {
      const lowStockCart = {
        ...validCart,
        lines: [
          {
            id: 1,
            product: { id: 1, name: 'Product 1', stock: 3 },
            quantity: 2
          }
        ]
      };
      const result = validateCart(lowStockCart);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(warning => warning.includes('low stock'))).toBe(true);
    });

    test('warns about high-value orders', () => {
      const highValueCart = {
        ...validCart,
        total: { value: 150000 } // $1500
      };
      const result = validateCart(highValueCart);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(warning => warning.includes('high-value order'))).toBe(true);
    });

    test('handles cart with missing product data', () => {
      const invalidProductCart = {
        lines: [
          {
            id: 1,
            product: null,
            quantity: 2
          }
        ],
        total: { value: 100 }
      };
      const result = validateCart(invalidProductCart);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('missing product information'))).toBe(true);
    });

    test('handles cart with duplicate products', () => {
      const duplicateCart = {
        lines: [
          {
            id: 1,
            product: { id: 1, name: 'Product 1', stock: 10 },
            quantity: 2
          },
          {
            id: 2,
            product: { id: 1, name: 'Product 1', stock: 10 },
            quantity: 3
          }
        ],
        total: { value: 500 }
      };
      const result = validateCart(duplicateCart);
      expect(result.warnings.some(warning => warning.includes('duplicate products'))).toBe(true);
    });
  });

  describe('validateShipping', () => {
    const validShippingInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    };

    test('validates complete shipping information', () => {
      const result = validateShipping(validShippingInfo);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects missing required fields', () => {
      const incompleteInfo = { ...validShippingInfo };
      delete incompleteInfo.firstName;
      delete incompleteInfo.email;
      
      const result = validateShipping(incompleteInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('First name is required');
      expect(result.errors).toContain('Email is required');
    });

    test('validates email format', () => {
      const invalidEmailInfo = {
        ...validShippingInfo,
        email: 'invalid-email'
      };
      const result = validateShipping(invalidEmailInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    test('validates phone number format', () => {
      const invalidPhoneInfo = {
        ...validShippingInfo,
        phone: '123'
      };
      const result = validateShipping(invalidPhoneInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid phone number');
    });

    test('validates zip code format', () => {
      const invalidZipInfo = {
        ...validShippingInfo,
        zipCode: '123'
      };
      const result = validateShipping(invalidZipInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid zip code');
    });

    test('handles empty shipping info', () => {
      const result = validateShipping({});
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3); // Multiple required fields missing
    });

    test('trims whitespace from fields', () => {
      const whitespaceInfo = {
        ...validShippingInfo,
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john@example.com  '
      };
      const result = validateShipping(whitespaceInfo);
      // The validation should still work with trimmed values
      expect(result.errors).not.toContain('First name is required');
      expect(result.errors).not.toContain('Last name is required');
      expect(result.errors).not.toContain('Email is required');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('passes arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});