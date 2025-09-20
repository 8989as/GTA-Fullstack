import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartService } from '../services';

// Cart Context
const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  FETCH_CART_START: 'FETCH_CART_START',
  FETCH_CART_SUCCESS: 'FETCH_CART_SUCCESS',
  FETCH_CART_FAILURE: 'FETCH_CART_FAILURE',
  ADD_TO_CART_START: 'ADD_TO_CART_START',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
  UPDATE_CART_ITEM_START: 'UPDATE_CART_ITEM_START',
  UPDATE_CART_ITEM_SUCCESS: 'UPDATE_CART_ITEM_SUCCESS',
  UPDATE_CART_ITEM_FAILURE: 'UPDATE_CART_ITEM_FAILURE',
  REMOVE_FROM_CART_START: 'REMOVE_FROM_CART_START',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  REMOVE_FROM_CART_FAILURE: 'REMOVE_FROM_CART_FAILURE',
  CLEAR_CART_START: 'CLEAR_CART_START',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.FETCH_CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CART_ACTIONS.FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        error: null,
      };

    case CART_ACTIONS.FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CART_ACTIONS.ADD_TO_CART_START:
    case CART_ACTIONS.UPDATE_CART_ITEM_START:
    case CART_ACTIONS.REMOVE_FROM_CART_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
    case CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS:
    case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload.cart,
        message: action.payload.message,
        error: null,
      };

    case CART_ACTIONS.ADD_TO_CART_FAILURE:
    case CART_ACTIONS.UPDATE_CART_ITEM_FAILURE:
    case CART_ACTIONS.REMOVE_FROM_CART_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };

    case CART_ACTIONS.CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
        error: null,
      };

    default:
      return state;
  }
};

// Initial cart state
const initialCartState = {
  loading: false,
  cart: null,
  error: null,
  message: null,
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Cart actions
  const fetchCart = async () => {
    dispatch({ type: CART_ACTIONS.FETCH_CART_START });
    
    const result = await CartService.getCart();
    
    if (result.success) {
      dispatch({
        type: CART_ACTIONS.FETCH_CART_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({
        type: CART_ACTIONS.FETCH_CART_FAILURE,
        payload: result.error,
      });
    }
    
    return result;
  };

  const addToCart = async (variantId, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART_START });
    
    const result = await CartService.addToCart(variantId, quantity);
    
    if (result.success) {
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
        payload: {
          cart: result.data,
          message: result.message,
        },
      });
    } else {
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_FAILURE,
        payload: result.error,
      });
    }
    
    return result;
  };

  const updateCartItem = async (lineId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_CART_ITEM_START });
    
    const result = await CartService.updateCartItem(lineId, quantity);
    
    if (result.success) {
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS,
        payload: {
          cart: result.data,
          message: result.message,
        },
      });
    } else {
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM_FAILURE,
        payload: result.error,
      });
    }
    
    return result;
  };

  const removeFromCart = async (lineId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_START });
    
    const result = await CartService.removeFromCart(lineId);
    
    if (result.success) {
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
        payload: {
          cart: result.data,
          message: result.message,
        },
      });
    } else {
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_FAILURE,
        payload: result.error,
      });
    }
    
    return result;
  };

  const clearCart = async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART_START });
    
    const result = await CartService.clearCart();
    
    if (result.success) {
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        payload: {
          cart: result.data,
          message: result.message,
        },
      });
    } else {
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: result.error,
      });
    }
    
    return result;
  };

  const clearMessage = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_MESSAGE });
  };

  // Helper functions
  const getCartItemsCount = () => {
    if (!state.cart || !state.cart.lines) return 0;
    return state.cart.lines.reduce((total, line) => total + line.quantity, 0);
  };

  const getCartTotal = () => {
    if (!state.cart || !state.cart.total) return 0;
    return state.cart.total.value || 0;
  };

  const getFormattedCartTotal = () => {
    if (!state.cart || !state.cart.total) return '$0.00';
    return state.cart.total.formatted || '$0.00';
  };

  const value = {
    ...state,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearMessage,
    getCartItemsCount,
    getCartTotal,
    getFormattedCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Cart hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;