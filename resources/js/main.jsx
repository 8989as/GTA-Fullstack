import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';

// Initialize React application
const container = document.getElementById('react-app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('React app container not found. Make sure there is an element with id="react-app" in your HTML.');
}