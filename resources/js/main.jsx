import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';
import { initializeCSRF } from './src/services/api';

// Initialize CSRF protection and React application
const initializeApp = async () => {
    // Initialize CSRF token for Sanctum authentication
    await initializeCSRF();

    // Initialize React application
    const container = document.getElementById('react-app');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    } else {
        console.error('React app container not found. Make sure there is an element with id="react-app" in your HTML.');
    }
};

// Start the application
initializeApp().catch(console.error);