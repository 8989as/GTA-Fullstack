// Re-export all contexts and providers
export { LanguageProvider, useLanguage } from './LanguageContext';
export { AuthProvider, useAuth } from './AuthContext';
export { CartProvider, useCart } from './CartContext';
export { ProductsProvider, useProducts } from './ProductsContext';

// Combined App Provider
import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductsProvider } from './ProductsContext';

export const AppProvider = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <ProductsProvider>
            {children}
          </ProductsProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default AppProvider;