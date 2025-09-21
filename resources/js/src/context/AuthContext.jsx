import { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthService } from '../services';

// Auth Context
const AuthContext = createContext();

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error,
        validationErrors: action.payload.validationErrors || null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        validationErrors: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        validationErrors: null,
      };

    default:
      return state;
  }
};

// Initial auth state
const initialAuthState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  validationErrors: null,
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = AuthService.getStoredToken();
      const user = AuthService.getStoredUser();

      if (token && user) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user, token },
        });
      }
    };

    initializeAuth();

    // Listen for logout events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    // Listen for auth logout events
    const handleAuthLogout = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  // Auth actions
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    const result = await AuthService.login(credentials);

    if (result.success) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error: result.error,
          validationErrors: result.validationErrors,
        },
      });
    }

    return result;
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    const result = await AuthService.register(userData);

    if (result.success) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: {
          error: result.error,
          validationErrors: result.validationErrors,
        },
      });
    }

    return result;
  };

  const logout = async () => {
    const result = await AuthService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    return result;
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;