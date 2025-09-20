import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useCart, useAuth } from '../context';
import { CheckoutService } from '../services';
import { PageHeader } from '../components';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cart, getFormattedCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    first_name: user?.name?.split(' ')[0] || '',
    last_name: user?.name?.split(' ').slice(1).join(' ') || '',
    line_one: '',
    line_two: '',
    city: '',
    state: '',
    postcode: '',
    country: 'SA'
  });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: '/' },
    { text: language === 'ar' ? 'سلة التسوق' : 'Cart', link: '/cart' },
    { text: language === 'ar' ? 'إتمام الطلب' : 'Checkout' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cart || cart.lines?.length === 0) {
      navigate('/cart');
      return;
    }

    fetchCheckoutData();
  }, [isAuthenticated, cart, navigate]);

  const fetchCheckoutData = async () => {
    setLoading(true);
    const result = await CheckoutService.getCheckout();

    if (result.success) {
      setCheckoutData(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateShippingAddress = () => {
    const errors = {};

    if (!shippingAddress.first_name.trim()) {
      errors.first_name = language === 'ar' ? 'الاسم الأول مطلوب' : 'First name is required';
    }

    if (!shippingAddress.last_name.trim()) {
      errors.last_name = language === 'ar' ? 'اسم العائلة مطلوب' : 'Last name is required';
    }

    if (!shippingAddress.line_one.trim()) {
      errors.line_one = language === 'ar' ? 'العنوان مطلوب' : 'Address is required';
    }

    if (!shippingAddress.city.trim()) {
      errors.city = language === 'ar' ? 'المدينة مطلوبة' : 'City is required';
    }

    if (!shippingAddress.postcode.trim()) {
      errors.postcode = language === 'ar' ? 'الرمز البريدي مطلوب' : 'Postal code is required';
    }

    return errors;
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();

    const errors = validateShippingAddress();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setProcessing(true);
    setError(null);

    const result = await CheckoutService.setShippingAddress(shippingAddress);

    if (result.success) {
      setStep(2);
      setValidationErrors({});
    } else {
      setError(result.error);
      if (result.validationErrors) {
        setValidationErrors(result.validationErrors);
      }
    }

    setProcessing(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    setProcessing(true);
    setError(null);

    const paymentData = {
      payment_method: paymentMethod,
    };

    const result = await CheckoutService.processPayment(paymentData);

    if (result.success) {
      // Clear cart and redirect to order confirmation
      await clearCart();
      navigate(`/order-confirmation/${result.data.order.id}`);
    } else {
      setError(result.error);
      if (result.validationErrors) {
        setValidationErrors(result.validationErrors);
      }
    }

    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.lines || [];

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
        breadcrumbs={breadcrumbs}
        image="/assets/images/page-header.png"
        alt="Checkout Header"
      />

      <div className="container py-5">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="progress-steps d-flex justify-content-center">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-title">{language === 'ar' ? 'عنوان الشحن' : 'Shipping'}</div>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-title">{language === 'ar' ? 'الدفع' : 'Payment'}</div>
              </div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-title">{language === 'ar' ? 'تأكيد' : 'Confirmation'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleShippingSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{language === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.first_name ? 'is-invalid' : ''}`}
                          name="first_name"
                          value={shippingAddress.first_name}
                          onChange={handleAddressChange}
                          required
                        />
                        {validationErrors.first_name && (
                          <div className="invalid-feedback">{validationErrors.first_name}</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{language === 'ar' ? 'اسم العائلة' : 'Last Name'}</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.last_name ? 'is-invalid' : ''}`}
                          name="last_name"
                          value={shippingAddress.last_name}
                          onChange={handleAddressChange}
                          required
                        />
                        {validationErrors.last_name && (
                          <div className="invalid-feedback">{validationErrors.last_name}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">{language === 'ar' ? 'العنوان' : 'Address Line 1'}</label>
                      <input
                        type="text"
                        className={`form-control ${validationErrors.line_one ? 'is-invalid' : ''}`}
                        name="line_one"
                        value={shippingAddress.line_one}
                        onChange={handleAddressChange}
                        required
                      />
                      {validationErrors.line_one && (
                        <div className="invalid-feedback">{validationErrors.line_one}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">{language === 'ar' ? 'العنوان الإضافي' : 'Address Line 2'}</label>
                      <input
                        type="text"
                        className="form-control"
                        name="line_two"
                        value={shippingAddress.line_two}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{language === 'ar' ? 'المدينة' : 'City'}</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          required
                        />
                        {validationErrors.city && (
                          <div className="invalid-feedback">{validationErrors.city}</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.postcode ? 'is-invalid' : ''}`}
                          name="postcode"
                          value={shippingAddress.postcode}
                          onChange={handleAddressChange}
                          required
                        />
                        {validationErrors.postcode && (
                          <div className="invalid-feedback">{validationErrors.postcode}</div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                        </>
                      ) : (
                        language === 'ar' ? 'التالي' : 'Continue to Payment'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-4">
                      <div className="form-check p-3 border rounded">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment_method"
                          id="cash_on_delivery"
                          value="cash_on_delivery"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label className="form-check-label w-100" htmlFor="cash_on_delivery">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-cash-coin text-success me-3 fs-4"></i>
                            <div>
                              <h6 className="mb-1">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</h6>
                              <small className="text-muted">
                                {language === 'ar'
                                  ? 'ادفع نقداً عند استلام طلبك'
                                  : 'Pay with cash when you receive your order'}
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(1)}
                        disabled={processing}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        {language === 'ar' ? 'رجوع' : 'Back'}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            {language === 'ar' ? 'إتمام الطلب' : 'Place Order'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h6>
              </div>
              <div className="card-body">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span className="text-truncate me-2">
                      {item.purchasable?.name} x{item.quantity}
                    </span>
                    <span>{item.total?.formatted}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</strong>
                  <strong className="text-primary">{getFormattedCartTotal()}</strong>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="card mt-3">
              <div className="card-body text-center">
                <i className="bi bi-shield-check text-success fs-2 mb-2"></i>
                <h6 className="mb-2">{language === 'ar' ? 'معاملة آمنة' : 'Secure Transaction'}</h6>
                <small className="text-muted">
                  {language === 'ar'
                    ? 'معلوماتك محمية بأعلى معايير الأمان'
                    : 'Your information is protected with the highest security standards'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;