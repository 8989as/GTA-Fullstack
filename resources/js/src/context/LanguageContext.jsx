import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');

  const toggleLanguage = (newLang) => {
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    // Load appropriate Bootstrap RTL/LTR CSS
    const bootstrapLink = document.getElementById('bootstrap-css');
    if (bootstrapLink) {
      bootstrapLink.href = newLang === 'ar'
        ? '/assets/css/bootstrap.rtl.min.css'
        : '/assets/css/bootstrap.min.css';
    }
  };

  // Update to properly load RTL Bootstrap CSS
  useEffect(() => {
    const loadBootstrapCSS = () => {
      const bootstrapLink = document.getElementById('bootstrap-css') ||
        document.createElement('link');

      bootstrapLink.id = 'bootstrap-css';
      bootstrapLink.rel = 'stylesheet';
      bootstrapLink.href = language === 'ar'
        ? '/assets/css/bootstrap.rtl.min.css'
        : '/assets/css/bootstrap.min.css';

      if (!document.getElementById('bootstrap-css')) {
        document.head.appendChild(bootstrapLink);
      }
    };

    loadBootstrapCSS();
  }, [language]);

  useEffect(() => {
    // Initialize direction based on initial language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};