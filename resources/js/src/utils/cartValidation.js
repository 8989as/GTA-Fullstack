/**
 * Cart Validation Utilities
 * Provides client-side validation for cart operations and stock availability
 */

/**
 * Validates if a quantity is valid for a cart item
 * @param {number} quantity - The quantity to validate
 * @param {Object} item - The cart item object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and error message
 */
export const validateQuantity = (quantity, item, options = {}) => {
  const { language = 'en', maxQuantity = 999 } = options;
  
  // Check if quantity is a positive integer
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      isValid: false,
      error: language === 'ar' 
        ? 'الكمية يجب أن تكون رقم صحيح أكبر من صفر'
        : 'Quantity must be a positive integer'
    };
  }
  
  // Check maximum quantity limit
  if (quantity > maxQuantity) {
    return {
      isValid: false,
      error: language === 'ar' 
        ? `الحد الأقصى للكمية هو ${maxQuantity}`
        : `Maximum quantity allowed is ${maxQuantity}`
    };
  }
  
  // Check stock availability if available
  if (item?.purchasable?.stock !== undefined && quantity > item.purchasable.stock) {
    return {
      isValid: false,
      error: language === 'ar' 
        ? `الكمية المتوفرة في المخزون: ${item.purchasable.stock}`
        : `Available stock: ${item.purchasable.stock}`
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates the entire cart before checkout
 * @param {Object} cart - The cart object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid, errors array, and warnings
 */
export const validateCart = (cart, options = {}) => {
  const { language = 'en' } = options;
  const errors = [];
  const warnings = [];
  
  // Check if cart exists and has items
  if (!cart || !cart.lines || cart.lines.length === 0) {
    errors.push({
      type: 'empty_cart',
      message: language === 'ar' 
        ? 'سلة التسوق فارغة'
        : 'Cart is empty'
    });
    return { isValid: false, errors, warnings };
  }
  
  // Validate each cart item
  cart.lines.forEach((line, index) => {
    const quantityValidation = validateQuantity(line.quantity, line, options);
    
    if (!quantityValidation.isValid) {
      errors.push({
        type: 'invalid_quantity',
        lineId: line.id,
        itemIndex: index,
        productName: line.purchasable?.product?.name || 'Unknown Product',
        message: quantityValidation.error
      });
    }
    
    // Check for discontinued products
    if (line.purchasable?.discontinued) {
      errors.push({
        type: 'discontinued_product',
        lineId: line.id,
        itemIndex: index,
        productName: line.purchasable?.product?.name || 'Unknown Product',
        message: language === 'ar' 
          ? 'هذا المنتج لم يعد متوفراً'
          : 'This product is no longer available'
      });
    }
    
    // Check for low stock warnings
    if (line.purchasable?.stock !== undefined && 
        line.purchasable.stock > 0 && 
        line.purchasable.stock <= 5 && 
        line.quantity <= line.purchasable.stock) {
      warnings.push({
        type: 'low_stock',
        lineId: line.id,
        itemIndex: index,
        productName: line.purchasable?.product?.name || 'Unknown Product',
        stock: line.purchasable.stock,
        message: language === 'ar' 
          ? `كمية محدودة متبقية: ${line.purchasable.stock} قطع`
          : `Limited stock remaining: ${line.purchasable.stock} items`
      });
    }
  });
  
  // Check minimum order value if specified
  if (options.minOrderValue && cart.total?.value < options.minOrderValue) {
    errors.push({
      type: 'minimum_order_value',
      message: language === 'ar' 
        ? `الحد الأدنى للطلب: ${options.minOrderValue}`
        : `Minimum order value: ${options.minOrderValue}`
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates shipping information
 * @param {Object} shippingInfo - The shipping information object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateShipping = (shippingInfo, options = {}) => {
  const { language = 'en', requiredFields = ['address', 'city', 'postal_code'] } = options;
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!shippingInfo[field] || shippingInfo[field].trim() === '') {
      errors.push({
        type: 'missing_field',
        field,
        message: language === 'ar' 
          ? `${getFieldNameAr(field)} مطلوب`
          : `${getFieldNameEn(field)} is required`
      });
    }
  });
  
  // Validate postal code format (basic validation)
  if (shippingInfo.postal_code && !/^[A-Za-z0-9\s-]{3,10}$/.test(shippingInfo.postal_code)) {
    errors.push({
      type: 'invalid_postal_code',
      field: 'postal_code',
      message: language === 'ar' 
        ? 'الرمز البريدي غير صحيح'
        : 'Invalid postal code format'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Helper function to get field names in Arabic
 */
const getFieldNameAr = (field) => {
  const fieldNames = {
    address: 'العنوان',
    city: 'المدينة',
    postal_code: 'الرمز البريدي',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني'
  };
  return fieldNames[field] || field;
};

/**
 * Helper function to get field names in English
 */
const getFieldNameEn = (field) => {
  const fieldNames = {
    address: 'Address',
    city: 'City',
    postal_code: 'Postal Code',
    phone: 'Phone Number',
    email: 'Email Address'
  };
  return fieldNames[field] || field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Debounce function for validation calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  validateQuantity,
  validateCart,
  validateShipping,
  debounce
};