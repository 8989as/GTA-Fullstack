import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useLanguage, useAuth } from '../context';
import { validateQuantity, validateCart, debounce } from '../utils/cartValidation';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    loading, 
    error, 
    message, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    clearMessage,
    getCartItemsCount,
    getFormattedCartTotal 
  } = useCart();
  
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [stockErrors, setStockErrors] = useState(new Map());
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Map());
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [isCartValid, setIsCartValid] = useState(true);

  // Debounced cart validation function
  const debouncedValidateCart = useCallback(
    debounce((cartData) => {
      if (!cartData || !cartData.lines) return;
      
      const validation = validateCart(cartData, { 
        language,
        maxQuantity: 999,
        minOrderValue: 0 // Can be configured based on business rules
      });
      
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);
      setIsCartValid(validation.isValid);
    }, 500),
    [language]
  );

  // Clear messages on component mount
  useEffect(() => {
    clearMessage();
  }, [clearMessage]);
  
  // Validate cart whenever it changes
  useEffect(() => {
    if (cart) {
      debouncedValidateCart(cart);
    }
  }, [cart, debouncedValidateCart]);

  // Handle quantity update with optimistic updates and validation
  const handleQuantityUpdate = async (lineId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Find the cart item
    const cartItem = cart?.lines?.find(line => line.id === lineId);
    if (!cartItem) return;
    
    // Client-side validation before API call
    const validation = validateQuantity(newQuantity, cartItem, { 
      language, 
      maxQuantity: 999 
    });
    
    if (!validation.isValid) {
      setStockErrors(prev => new Map(prev).set(lineId, validation.error));
      return;
    }
    
    // Clear any previous stock errors for this item
    setStockErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(lineId);
      return newMap;
    });
    
    // Set optimistic update
    setOptimisticUpdates(prev => new Map(prev).set(lineId, newQuantity));
    setUpdatingItems(prev => new Set(prev).add(lineId));
    
    try {
      await updateCartItem(lineId, newQuantity);
      // Clear optimistic update on success
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(lineId);
        return newMap;
      });
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(lineId);
        return newMap;
      });
      
      // Handle specific stock errors
      if (error.message && error.message.includes('stock')) {
        setStockErrors(prev => new Map(prev).set(lineId, 
          language === 'ar' 
            ? 'الكمية المطلوبة غير متوفرة في المخزون'
            : 'Requested quantity not available in stock'
        ));
      } else {
        // Handle other validation errors
        setStockErrors(prev => new Map(prev).set(lineId, 
          error.message || (language === 'ar' 
            ? 'حدث خطأ أثناء تحديث الكمية'
            : 'Error updating quantity')
        ));
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (lineId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to remove this item?')) {
      await removeFromCart(lineId);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف جميع المنتجات؟' : 'Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  // Handle checkout with comprehensive validation
  const handleCheckout = () => {
    // Check for stock errors
    if (stockErrors.size > 0) {
      alert(language === 'ar' 
        ? 'يرجى حل مشاكل المخزون قبل المتابعة'
        : 'Please resolve stock issues before proceeding'
      );
      return;
    }
    
    // Check for pending updates
    if (updatingItems.size > 0) {
      alert(language === 'ar' 
        ? 'يرجى انتظار انتهاء تحديث الكميات'
        : 'Please wait for quantity updates to complete'
      );
      return;
    }
    
    // Check cart validation
    if (!isCartValid || validationErrors.length > 0) {
      const errorMessages = validationErrors.map(error => error.message).join('\n');
      alert(language === 'ar' 
        ? `يرجى حل المشاكل التالية قبل المتابعة:\n${errorMessages}`
        : `Please resolve the following issues before proceeding:\n${errorMessages}`
      );
      return;
    }
    
    // Show warnings if any (but allow to proceed)
    if (validationWarnings.length > 0) {
      const warningMessages = validationWarnings.map(warning => warning.message).join('\n');
      const proceed = window.confirm(
        (language === 'ar' 
          ? `تحذيرات:\n${warningMessages}\n\nهل تريد المتابعة؟`
          : `Warnings:\n${warningMessages}\n\nDo you want to proceed?`)
      );
      if (!proceed) return;
    }
    
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </span>
              </div>
              <p className="mt-3">{language === 'ar' ? 'جاري تحميل السلة...' : 'Loading cart...'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || !cart.lines || cart.lines.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="empty-cart">
              <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
              <h2 className="mb-3">
                {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
              </h2>
              <p className="text-muted mb-4">
                {language === 'ar' 
                  ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق بعد'
                  : "You haven't added any items to your cart yet"
                }
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                <i className="bi bi-arrow-left me-2"></i>
                {language === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
              <span className="badge bg-primary ms-2">
                {getCartItemsCount()} {language === 'ar' ? 'منتج' : 'items'}
              </span>
            </h1>
            {cart.lines.length > 0 && (
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleClearCart}
                disabled={loading}
              >
                <i className="bi bi-trash me-1"></i>
                {language === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={clearMessage}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {message}
              <button 
                type="button" 
                className="btn-close" 
                onClick={clearMessage}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <h6 className="alert-heading">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {language === 'ar' ? 'مشاكل في السلة' : 'Cart Issues'}
              </h6>
              <ul className="mb-0">
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    {error.productName && (
                      <strong>{error.productName}: </strong>
                    )}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validation Warnings */}
          {validationWarnings.length > 0 && (
            <div className="alert alert-warning" role="alert">
              <h6 className="alert-heading">
                <i className="bi bi-info-circle me-2"></i>
                {language === 'ar' ? 'تحذيرات' : 'Warnings'}
              </h6>
              <ul className="mb-0">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>
                    {warning.productName && (
                      <strong>{warning.productName}: </strong>
                    )}
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    {language === 'ar' ? 'المنتجات' : 'Items'}
                  </h5>
                </div>
                <div className="card-body p-0">
                  {cart.lines.map((line) => (
                    <div key={line.id} className="cart-item border-bottom p-3">
                      <div className="row align-items-center">
                        {/* Product Image */}
                        <div className="col-md-2 col-3">
                          <div className="product-image">
                            {line.purchasable?.thumbnail ? (
                              <img 
                                src={line.purchasable.thumbnail} 
                                alt={line.purchasable.product?.name || 'Product'}
                                className="img-fluid rounded"
                              />
                            ) : (
                              <div className="placeholder-image d-flex align-items-center justify-content-center bg-light rounded">
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-md-4 col-9">
                          <h6 className="product-name mb-1">
                            {line.purchasable?.product?.name || 'Product Name'}
                          </h6>
                          {line.purchasable?.product?.brand && (
                            <p className="text-muted small mb-1">
                              {language === 'ar' ? 'الماركة:' : 'Brand:'} {line.purchasable.product.brand}
                            </p>
                          )}
                          {line.purchasable?.sku && (
                            <p className="text-muted small mb-0">
                              {language === 'ar' ? 'رقم المنتج:' : 'SKU:'} {line.purchasable.sku}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-md-3 col-6">
                          <div className="quantity-controls d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-1">
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleQuantityUpdate(line.id, line.quantity - 1)}
                                disabled={line.quantity <= 1 || updatingItems.has(line.id)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="quantity-display mx-3 fw-bold">
                                {updatingItems.has(line.id) ? (
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                ) : (
                                  optimisticUpdates.has(line.id) ? optimisticUpdates.get(line.id) : line.quantity
                                )}
                              </span>
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleQuantityUpdate(line.id, line.quantity + 1)}
                                disabled={updatingItems.has(line.id)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                            {stockErrors.has(line.id) && (
                              <div className="text-danger small text-center">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                {stockErrors.get(line.id)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="col-md-3 col-6">
                          <div className="text-end">
                            <div className="price mb-2">
                              <span className="fw-bold">
                                {line.total?.formatted || '$0.00'}
                              </span>
                              {line.unit_price?.formatted && (
                                <small className="text-muted d-block">
                                  {line.unit_price.formatted} {language === 'ar' ? 'للقطعة' : 'each'}
                                </small>
                              )}
                            </div>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveItem(line.id)}
                              disabled={loading}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-3">
                <Link to="/products" className="btn btn-outline-primary">
                  <i className="bi bi-arrow-left me-2"></i>
                  {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>{cart.sub_total?.formatted || '$0.00'}</span>
                  </div>
                  
                  {cart.tax_total && cart.tax_total.value > 0 && (
                    <div className="summary-row d-flex justify-content-between mb-2">
                      <span>{language === 'ar' ? 'الضريبة:' : 'Tax:'}</span>
                      <span>{cart.tax_total.formatted}</span>
                    </div>
                  )}
                  
                  {cart.shipping_total && cart.shipping_total.value > 0 && (
                    <div className="summary-row d-flex justify-content-between mb-2">
                      <span>{language === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                      <span>{cart.shipping_total.formatted}</span>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="summary-row d-flex justify-content-between mb-3">
                    <strong>{language === 'ar' ? 'المجموع الكلي:' : 'Total:'}</strong>
                    <strong className="text-primary">{getFormattedCartTotal()}</strong>
                  </div>

                  <button 
                    className={`btn btn-lg w-100 ${
                      !isCartValid || validationErrors.length > 0 || stockErrors.size > 0
                        ? 'btn-danger' 
                        : updatingItems.size > 0 
                        ? 'btn-warning' 
                        : validationWarnings.length > 0
                        ? 'btn-warning'
                        : 'btn-primary'
                    }`}
                    onClick={handleCheckout}
                    disabled={loading || cart.lines.length === 0 || (!isCartValid && validationErrors.length > 0)}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                      </>
                    ) : !isCartValid || validationErrors.length > 0 ? (
                      <>
                        <i className="bi bi-x-circle me-2"></i>
                        {language === 'ar' ? 'حل مشاكل السلة' : 'Fix Cart Issues'}
                      </>
                    ) : stockErrors.size > 0 ? (
                      <>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {language === 'ar' ? 'حل مشاكل المخزون' : 'Resolve Stock Issues'}
                      </>
                    ) : updatingItems.size > 0 ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Updating...</span>
                        </div>
                        {language === 'ar' ? 'جاري التحديث...' : 'Updating...'}
                      </>
                    ) : validationWarnings.length > 0 ? (
                      <>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {language === 'ar' ? 'متابعة مع التحذيرات' : 'Proceed with Warnings'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        {language === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
                      </>
                    )}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-muted small mt-2 text-center">
                      {language === 'ar' 
                        ? 'سيتم توجيهك لتسجيل الدخول قبل إتمام الطلب'
                        : 'You will be redirected to login before checkout'
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Security Badge */}
              <div className="card mt-3">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check text-success display-6 mb-2"></i>
                  <p className="small text-muted mb-0">
                    {language === 'ar' 
                      ? 'معاملات آمنة ومشفرة'
                      : 'Secure & encrypted transactions'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;