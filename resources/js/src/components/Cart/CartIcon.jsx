import React from 'react';
import { useCart, useLanguage } from '../../context';

const CartIcon = ({ className = '' }) => {
  const { cart, getCartItemsCount, getFormattedCartTotal } = useCart();
  const { language } = useLanguage();
  
  const itemsCount = getCartItemsCount();
  const totalPrice = getFormattedCartTotal();

  return (
    <div className={`cart-icon-wrapper ${className}`}>
      <div className="cart-icon position-relative">
        <i className="bi bi-bag-check-fill"></i>
        {itemsCount > 0 && (
          <span className="cart-badge position-absolute translate-middle badge rounded-pill bg-danger">
            {itemsCount > 99 ? '99+' : itemsCount}
          </span>
        )}
      </div>
      
      {itemsCount > 0 && (
        <div className="cart-total">
          <span className="total-amount">{totalPrice}</span>
        </div>
      )}
    </div>
  );
};

export default CartIcon;