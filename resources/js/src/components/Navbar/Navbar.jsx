import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, useAuth, useCart } from "../../context";
import "./Navbar.css";

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <div className={`navbar fixed-top d-flex align-items-center ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src="/assets/images/logo.svg" 
            alt="Logo" 
            className={language === 'ar' ? 'ms-2' : 'me-2'}
            style={{ width: "125px", height: "35px" }} 
          />
        </Link>

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
                <Link className="nav-link" to="/">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  {language === 'ar' ? 'عن الشركة' : 'About'}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  {language === 'ar' ? 'قطع الغيار' : 'Spare Parts'}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/blog">
                  {language === 'ar' ? 'المدونة' : 'Blog'}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact'}
                </Link>
              </li>
            </ul>

            {/* Cart and Auth Section */}
            <div className="d-flex align-items-center ms-3">
              {/* Cart Icon */}
              <Link to="/cart" className="btn btn-outline-primary position-relative me-2">
                <i className="bi bi-cart"></i>
                {cartItemsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <i className="bi bi-person"></i>
                    <span className="ms-1 d-none d-md-inline">
                      {user?.name || (language === 'ar' ? 'المستخدم' : 'User')}
                    </span>
                  </button>
                  {showUserDropdown && (
                    <ul className="dropdown-menu dropdown-menu-end show">
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/profile"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <i className="bi bi-person me-2"></i>
                          {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/orders"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <i className="bi bi-bag me-2"></i>
                          {language === 'ar' ? 'طلباتي' : 'My Orders'}
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/auth/login" className="btn btn-outline-primary">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span className="ms-1 d-none d-md-inline">
                      {language === 'ar' ? 'دخول' : 'Login'}
                    </span>
                  </Link>
                  <Link to="/auth/register" className="btn btn-primary">
                    <i className="bi bi-person-plus"></i>
                    <span className="ms-1 d-none d-md-inline">
                      {language === 'ar' ? 'تسجيل' : 'Register'}
                    </span>
                  </Link>
                </div>
              )}

              {/* Language Switcher */}
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
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

