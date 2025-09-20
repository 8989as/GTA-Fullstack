/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../src/context';
import Products from '../src/components/SpareParts/Products/Products';

// Mock API service
jest.mock('../src/services/ProductService', () => ({
  ProductService: {
    getProducts: jest.fn(() => Promise.resolve({
      success: true,
      data: [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test Description',
          images: [{ url: 'test-image.jpg' }],
          variants: [{ 
            id: 1, 
            price: 100, 
            formatted_price: '$100.00',
            stock: 10 
          }]
        }
      ],
      pagination: { current_page: 1, last_page: 1, total: 1 }
    })),
    searchProducts: jest.fn(() => Promise.resolve({
      success: true,
      data: [],
      pagination: null
    }))
  }
}));

const renderWithProvider = (component) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Products Component', () => {
  test('renders products grid', async () => {
    renderWithProvider(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    renderWithProvider(<Products />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays add to cart button', async () => {
    renderWithProvider(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
    });
  });
});

export default {};