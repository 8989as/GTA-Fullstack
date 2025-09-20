import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth, useCart } from '../context';

const TestComponent = () => {
    const [renderTime, setRenderTime] = useState(null);
    const [apiStatus, setApiStatus] = useState('testing');
    const { language, toggleLanguage } = useLanguage();
    const { isAuthenticated } = useAuth();
    const { cart } = useCart();

    useEffect(() => {
        setRenderTime(new Date().toLocaleString());
    }, []);

    const testApiCall = async () => {
        setApiStatus('testing');
        try {
            // Test the API endpoint we created
            const response = await fetch('/api/test', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);
                setApiStatus('success');
            } else {
                console.error('API Error:', response.status, response.statusText);
                setApiStatus('failed');
            }
        } catch (error) {
            console.error('API test failed:', error);
            setApiStatus('failed');
        }
    };

    const handleLanguageToggle = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        toggleLanguage(newLang);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                {language === 'ar' ? 'اختبار تكامل React' : 'React Integration Test'}
                            </h4>
                        </div>
                        <div className="card-body">
                            {/* React Rendering Test */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-check-circle"></i>{' '}
                                    {language === 'ar' ? 'React يعمل بنجاح!' : 'React is working!'}
                                </h5>
                                <p className="text-muted">
                                    {language === 'ar' ? 'وقت التحميل:' : 'Rendered at:'} {renderTime}
                                </p>
                            </div>

                            {/* Language Context Test */}
                            <div className="mb-4">
                                <h6>{language === 'ar' ? 'اختبار تبديل اللغة:' : 'Language Toggle Test:'}</h6>
                                <p>
                                    {language === 'ar' ? 'اللغة الحالية:' : 'Current Language:'}{' '}
                                    <span className="badge bg-info">{language.toUpperCase()}</span>
                                </p>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={handleLanguageToggle}
                                >
                                    {language === 'ar' ? 'تبديل إلى English' : 'Switch to العربية'}
                                </button>
                            </div>

                            {/* Authentication Context Test */}
                            <div className="mb-4">
                                <h6>{language === 'ar' ? 'حالة المصادقة:' : 'Authentication Status:'}</h6>
                                <span className={`badge ${isAuthenticated ? 'bg-success' : 'bg-warning'}`}>
                                    {isAuthenticated
                                        ? (language === 'ar' ? 'مسجل الدخول' : 'Authenticated')
                                        : (language === 'ar' ? 'غير مسجل' : 'Not Authenticated')
                                    }
                                </span>
                            </div>

                            {/* Cart Context Test */}
                            <div className="mb-4">
                                <h6>{language === 'ar' ? 'حالة السلة:' : 'Cart Status:'}</h6>
                                <p>
                                    {language === 'ar' ? 'عدد العناصر:' : 'Items count:'}{' '}
                                    <span className="badge bg-secondary">{cart?.length || 0}</span>
                                </p>
                            </div>

                            {/* API Communication Test */}
                            <div className="mb-4">
                                <h6>{language === 'ar' ? 'اختبار API:' : 'API Test:'}</h6>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-success btn-sm"
                                        onClick={testApiCall}
                                        disabled={apiStatus === 'testing'}
                                    >
                                        {apiStatus === 'testing'
                                            ? (language === 'ar' ? 'جاري الاختبار...' : 'Testing...')
                                            : (language === 'ar' ? 'اختبار API' : 'Test API')
                                        }
                                    </button>
                                    <span className={`badge ${apiStatus === 'success' ? 'bg-success' :
                                        apiStatus === 'failed' ? 'bg-danger' : 'bg-secondary'
                                        }`}>
                                        {apiStatus === 'success' && (language === 'ar' ? 'نجح' : 'Success')}
                                        {apiStatus === 'failed' && (language === 'ar' ? 'فشل' : 'Failed')}
                                        {apiStatus === 'testing' && (language === 'ar' ? 'جاري...' : 'Testing...')}
                                    </span>
                                </div>
                            </div>

                            {/* Development Server Status */}
                            <div className="mb-4">
                                <h6>{language === 'ar' ? 'حالة الخادم:' : 'Server Status:'}</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            {language === 'ar' ? 'المنفذ الحالي:' : 'Current Port:'}{' '}
                                            <code>{window.location.port || '80'}</code>
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            {language === 'ar' ? 'المضيف:' : 'Host:'}{' '}
                                            <code>{window.location.hostname}</code>
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* HMR Test */}
                            <div className="alert alert-info">
                                <small>
                                    <i className="bi bi-info-circle"></i>{' '}
                                    {language === 'ar'
                                        ? 'لاختبار HMR، قم بتعديل هذا المكون وشاهد التحديث التلقائي'
                                        : 'To test HMR, modify this component and watch for automatic updates'
                                    }
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestComponent;