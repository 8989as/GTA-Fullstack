import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../../context/LanguageContext";
import "./Navbar.css";

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const toggleScrolled = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    return () => {
      window.removeEventListener('scroll', toggleScrolled);
      window.removeEventListener('load', toggleScrolled);
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (e) => {
    toggleLanguage(e.target.value);
  };

  // Handle mobile nav toggle
  const handleMobileNavToggle = () => {
    setIsMobileNavActive(!isMobileNavActive);
  };

  // Handle nav link click
  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    handleMobileNavToggle(); // Close mobile menu
    navigate(path);
  };

  return (
    <div className={`navbar fixed-top d-flex align-items-center ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <a 
          href="/" 
          className="navbar-brand d-flex align-items-center" 
          onClick={(e) => handleNavLinkClick(e, '/')}
        >
          <img 
            src="/assets/images/logo.svg" 
            alt="Logo" 
            className={language === 'ar' ? 'ms-2' : 'me-2'}
            style={{ width: "125px", height: "35px" }} 
          />
        </a>

        <nav id="navmenu" className={`navbar navbar-expand-xl ${isMobileNavActive ? 'mobile-nav-active' : ''}`}>
          <button
            className={`navbar-toggler d-xl-none mobile-nav-toggle ${isMobileNavActive ? 'bi-x' : 'bi-list'}`}
            type="button"
            onClick={handleMobileNavToggle}
            aria-controls="navbarSupportedContent"
            aria-expanded={isMobileNavActive}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${isMobileNavActive ? 'bi-x' : 'bi-list'}`}></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a 
                  className="nav-link active" 
                  aria-current="page" 
                  href="index.html"
                  onClick={(e) => handleNavLinkClick(e, '/')}
                >
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="about.html"
                  onClick={(e) => handleNavLinkClick(e, '/about')}
                >
                  {language === 'ar' ? 'عن الشركة' : 'About'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="services.html"
                  onClick={(e) => handleNavLinkClick(e, '/services')}
                >
                  {language === 'ar' ? 'خدماتنا' : 'Services'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="spare-parts.html"
                  onClick={(e) => handleNavLinkClick(e, '/spare-parts')}
                >
                  {language === 'ar' ? 'قطع الغيار' : 'Spare Parts'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="portfolio.html"
                  onClick={(e) => handleNavLinkClick(e, '/portfolio')}
                >
                  {language === 'ar' ? 'أعمالنا' : 'Portfolio'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="blog.html"
                  onClick={(e) => handleNavLinkClick(e, '/blog')}
                >
                  {language === 'ar' ? 'المدونة' : 'Blog'}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="contact.html"
                  onClick={(e) => handleNavLinkClick(e, '/contact')}
                >
                  {language === 'ar' ? 'اتصل بنا' : 'Contact'}
                </a>
              </li>
            </ul>

            <div className={`lang-switcher ${language === 'ar' ? 'me-3' : 'ms-3'}`}>
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="form-select form-select-sm"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

