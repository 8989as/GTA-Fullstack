import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { useLanguage } from './context/LanguageContext';
import { Suspense, lazy } from 'react';

// Lazy load components
const Homepage = lazy(() => import('./Pages/Homepage'));
const About = lazy(() => import('./Pages/About'));
const SpareParts = lazy(() => import('./Pages/SpareParts'));
const BlogPage = lazy(() => import('./Pages/Blog'));
const Contact = lazy(() => import('./Pages/Contact'));

// Import Shared Layout Components
import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer'; // Assuming this exists

// Loading Component
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Router>
      <div className={`app-container ${language}`}>
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
          
          {/* Spare Parts Route */}
          <Route 
            path="/spare-parts" 
            element={<Suspense fallback={<LoadingSpinner />}><SpareParts /></Suspense>} 
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
        
        {/* <Footer /> */}
      </div>
    </Router>
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
        {language === 'ar' ? 'العودة لل首页' : 'Go to Home'}
      </button>
    </div>
  );
};

export default App;
