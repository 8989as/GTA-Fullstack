// Re-export all contexts and providers
export { LanguageProvider, useLanguage } from './LanguageContext.jsx';
export { AuthProvider, useAuth } from './AuthContext.jsx';
export { CartProvider, useCart } from './CartContext.jsx';
export { ProductsProvider, useProducts } from './ProductsContext.jsx';

// Combined App Provider
import React from 'react';
import { LanguageProvider } from './LanguageContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { ProductsProvider } from './ProductsContext.jsx';

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