import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { AppProvider, useLanguage, useAuth } from './src/context';
import { Suspense, lazy } from 'react';

// Lazy load components
const Homepage = lazy(() => import('./src/Pages/Homepage'));
const About = lazy(() => import('./src/Pages/About'));
const SpareParts = lazy(() => import('./src/Pages/SpareParts'));
const BlogPage = lazy(() => import('./src/Pages/Blog'));
const Contact = lazy(() => import('./src/Pages/Contact'));

// E-commerce pages
const ProductDetail = lazy(() => import('./src/Pages/ProductDetail'));
const CartPage = lazy(() => import('./src/Pages/Cart'));
const CheckoutPage = lazy(() => import('./src/Pages/Checkout'));
const ProfilePage = lazy(() => import('./src/Pages/Profile'));
const OrdersPage = lazy(() => import('./src/Pages/Orders'));
const OrderConfirmationPage = lazy(() => import('./src/Pages/OrderConfirmation'));
const AuthPage = lazy(() => import('./src/Pages/Auth'));

// Import Shared Layout Components
import { Navbar } from './src/components';
import TestComponent from './src/components/TestComponent';

// Loading Component
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// App Content Component
const AppContent = () => {
  const { language } = useLanguage();

  return (
    <Router>
      <div className={`app-container ${language}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />

        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={<Suspense fallback={<LoadingSpinner />}><Homepage /></Suspense>}
          />

          {/* About Route */}
          <Route
            path="/about"
            element={<Suspense fallback={<LoadingSpinner />}><About /></Suspense>}
          />

          {/* Spare Parts / Products Route */}
          <Route
            path="/products"
            element={<Suspense fallback={<LoadingSpinner />}><SpareParts /></Suspense>}
          />
          <Route
            path="/spare-parts"
            element={<Navigate to="/products" replace />}
          />

          {/* Product Detail Route */}
          <Route
            path="/products/:slug"
            element={<Suspense fallback={<LoadingSpinner />}><ProductDetail /></Suspense>}
          />

          {/* Cart Route */}
          <Route
            path="/cart"
            element={<Suspense fallback={<LoadingSpinner />}><CartPage /></Suspense>}
          />

          {/* Auth Routes */}
          <Route
            path="/auth/:type"
            element={<Suspense fallback={<LoadingSpinner />}><AuthPage /></Suspense>}
          />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}><CheckoutPage /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}><ProfilePage /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}><OrdersPage /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}><OrderConfirmationPage /></Suspense>
              </ProtectedRoute>
            }
          />

          {/* Blog Route */}
          <Route
            path="/blog"
            element={<Suspense fallback={<LoadingSpinner />}><BlogPage /></Suspense>}
          />

          {/* Contact Route */}
          <Route
            path="/contact"
            element={<Suspense fallback={<LoadingSpinner />}><Contact /></Suspense>}
          />

          {/* Search Route */}
          <Route
            path="/search"
            element={<Suspense fallback={<LoadingSpinner />}><SpareParts /></Suspense>}
          />

          {/* Test Route */}
          <Route
            path="/test"
            element={<TestComponent />}
          />

          {/* Collections Route */}
          <Route
            path="/collections/:slug"
            element={<Suspense fallback={<LoadingSpinner />}><SpareParts /></Suspense>}
          />

          {/* Redirect from old .html routes */}
          <Route
            path="/about.html"
            element={<Navigate to="/about" replace />}
          />
          <Route
            path="/contact.html"
            element={<Navigate to="/contact" replace />}
          />
          <Route
            path="/blog.html"
            element={<Navigate to="/blog" replace />}
          />

          {/* Catch all - 404 Page */}
          <Route
            path="*"
            element={<NotFound language={language} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

// 404 Not Found Component
const NotFound = ({ language }) => {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 mb-4">404</h1>
      <h2 className="mb-4">
        {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </h2>
      <p className="mb-4">
        {language === 'ar'
          ? 'عذرًا، الصفحة التي تبحث عنها غير متوفرة.'
          : 'Sorry, the page you are looking for does not exist.'}
      </p>
      <button
        className="btn btn-primary"
        onClick={() => window.location.href = '/'}
      >
        {language === 'ar' ? 'العودة للرئيسية' : 'Go to Home'}
      </button>
    </div>
  );
};

export default App;
