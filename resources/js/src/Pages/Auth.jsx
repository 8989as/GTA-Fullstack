import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../context';

const AuthPage = () => {
  const { type } = useParams(); // 'login' or 'register'
  const navigate = useNavigate();
  const { login, register, loading, error, validationErrors, clearError, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isLogin = type === 'login';
  const isRegister = type === 'register';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error || validationErrors) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = isLogin 
      ? await login({ email: formData.email, password: formData.password })
      : await register(formData);
    
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const switchAuthType = () => {
    navigate(isLogin ? '/auth/register' : '/auth/login', { replace: true });
    setFormData({ name: '', email: '', password: '', password_confirmation: '' });
    clearError();
  };

  const getValidationError = (field) => {
    return validationErrors && validationErrors[field] ? validationErrors[field][0] : null;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">
                {isLogin 
                  ? (language === 'ar' ? 'تسجيل الدخول' : 'Login')
                  : (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account')
                }
              </h3>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Name field for registration */}
                {isRegister && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${getValidationError('name') ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {getValidationError('name') && (
                      <div className="invalid-feedback">
                        {getValidationError('name')}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Email field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    className={`form-control ${getValidationError('email') ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {getValidationError('email') && (
                    <div className="invalid-feedback">
                      {getValidationError('email')}
                    </div>
                  )}
                </div>
                
                {/* Password field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${getValidationError('password') ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {getValidationError('password') && (
                    <div className="invalid-feedback">
                      {getValidationError('password')}
                    </div>
                  )}
                </div>
                
                {/* Password confirmation for registration */}
                {isRegister && (
                  <div className="mb-4">
                    <label htmlFor="password_confirmation" className="form-label">
                      {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      className={`form-control ${getValidationError('password_confirmation') ? 'is-invalid' : ''}`}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                    />
                    {getValidationError('password_confirmation') && (
                      <div className="invalid-feedback">
                        {getValidationError('password_confirmation')}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Submit button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {isLogin 
                          ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing In...')
                          : (language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...')
                        }
                      </>
                    ) : (
                      isLogin 
                        ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                        : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')
                    )}
                  </button>
                </div>
              </form>
              
              {/* Switch between login/register */}
              <div className="text-center">
                <p className="mb-0">
                  {isLogin 
                    ? (language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?")
                    : (language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?')
                  }
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-1"
                    onClick={switchAuthType}
                  >
                    {isLogin 
                      ? (language === 'ar' ? 'إنشاء حساب جديد' : 'Create one')
                      : (language === 'ar' ? 'تسجيل الدخول' : 'Sign in')
                    }
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;