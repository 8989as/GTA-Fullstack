import { createContext, useContext, useReducer, useEffect } from 'react';
import { ProductService } from '../services';
import { parseFiltersFromURL, buildURLFromFilters, useURLParams } from '../utils/urlState';

// Products Context
const ProductsContext = createContext();

// Products actions
const PRODUCTS_ACTIONS = {
  FETCH_PRODUCTS_START: 'FETCH_PRODUCTS_START',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
  SEARCH_PRODUCTS_START: 'SEARCH_PRODUCTS_START',
  SEARCH_PRODUCTS_SUCCESS: 'SEARCH_PRODUCTS_SUCCESS',
  SEARCH_PRODUCTS_FAILURE: 'SEARCH_PRODUCTS_FAILURE',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  RESET_SEARCH: 'RESET_SEARCH',
};

// Products reducer
const productsReducer = (state, action) => {
  switch (action.type) {
    case PRODUCTS_ACTIONS.FETCH_PRODUCTS_START:
    case PRODUCTS_ACTIONS.SEARCH_PRODUCTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PRODUCTS_ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pagination: action.payload.pagination,
        error: null,
        isSearchResults: false,
      };

    case PRODUCTS_ACTIONS.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pagination: action.payload.pagination,
        error: null,
        isSearchResults: true,
        searchQuery: action.payload.searchQuery,
      };

    case PRODUCTS_ACTIONS.FETCH_PRODUCTS_FAILURE:
    case PRODUCTS_ACTIONS.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        products: [],
        pagination: null,
      };

    case PRODUCTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        currentPage: 1, // Reset to first page when filters change
      };

    case PRODUCTS_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          brand: '',
          model: '',
          year: '',
          part_type: 'original',
          price_min: '',
          price_max: '',
        },
        currentPage: 1,
      };

    case PRODUCTS_ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
        currentPage: 1, // Reset to first page when sort changes
      };

    case PRODUCTS_ACTIONS.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case PRODUCTS_ACTIONS.RESET_SEARCH:
      return {
        ...state,
        isSearchResults: false,
        searchQuery: '',
      };

    default:
      return state;
  }
};

// Initial products state - load from URL if available
const getInitialState = () => {
  const urlFilters = parseFiltersFromURL();
  return {
    loading: false,
    products: [],
    pagination: null,
    error: null,
    filters: {
      brand: urlFilters.brand || '',
      model: urlFilters.model || '',
      year: urlFilters.year || '',
      part_type: urlFilters.part_type || 'original',
      price_min: urlFilters.price_min || '',
      price_max: urlFilters.price_max || '',
    },
    sortBy: 'name',
    currentPage: urlFilters.page || 1,
    isSearchResults: !!urlFilters.q,
    searchQuery: urlFilters.q || '',
  };
};

// Products Provider component
export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, getInitialState());
  const { updateURLParams } = useURLParams();

  // Fetch products when filters, sort, or page changes
  useEffect(() => {
    if (!state.isSearchResults) {
      fetchProducts();
    }
  }, [state.filters, state.sortBy, state.currentPage]);

  // Products actions
  const fetchProducts = async () => {
    dispatch({ type: PRODUCTS_ACTIONS.FETCH_PRODUCTS_START });

    const params = {
      page: state.currentPage,
      per_page: 12,
      sort_by: state.sortBy,
      ...state.filters,
    };

    // Remove empty filter values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    const result = await ProductService.getProducts(params);

    if (result.success) {
      dispatch({
        type: PRODUCTS_ACTIONS.FETCH_PRODUCTS_SUCCESS,
        payload: {
          products: result.data,
          pagination: result.pagination,
        },
      });
    } else {
      dispatch({
        type: PRODUCTS_ACTIONS.FETCH_PRODUCTS_FAILURE,
        payload: result.error,
      });
    }

    return result;
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      dispatch({ type: PRODUCTS_ACTIONS.RESET_SEARCH });
      return;
    }

    dispatch({ type: PRODUCTS_ACTIONS.SEARCH_PRODUCTS_START });

    const params = {
      page: 1,
      per_page: 12,
      ...state.filters,
    };

    const result = await ProductService.searchProducts(query, params);

    if (result.success) {
      dispatch({
        type: PRODUCTS_ACTIONS.SEARCH_PRODUCTS_SUCCESS,
        payload: {
          products: result.data,
          pagination: result.pagination,
          searchQuery: query,
        },
      });
    } else {
      dispatch({
        type: PRODUCTS_ACTIONS.SEARCH_PRODUCTS_FAILURE,
        payload: result.error,
      });
    }

    return result;
  };

  const setFilters = (newFilters) => {
    dispatch({
      type: PRODUCTS_ACTIONS.SET_FILTERS,
      payload: newFilters,
    });

    // Update URL with new filters
    const urlString = buildURLFromFilters(newFilters, state.searchQuery);
    updateURLParams(Object.fromEntries(new URLSearchParams(urlString)));
  };

  const clearFilters = () => {
    dispatch({ type: PRODUCTS_ACTIONS.CLEAR_FILTERS });
  };

  const setSortBy = (sortBy) => {
    dispatch({
      type: PRODUCTS_ACTIONS.SET_SORT_BY,
      payload: sortBy,
    });
  };

  const setCurrentPage = (page) => {
    dispatch({
      type: PRODUCTS_ACTIONS.SET_CURRENT_PAGE,
      payload: page,
    });

    // Update URL with new page
    updateURLParams({ page: page > 1 ? page : undefined });
  };

  const resetSearch = () => {
    dispatch({ type: PRODUCTS_ACTIONS.RESET_SEARCH });
  };

  // Helper functions
  const hasActiveFilters = () => {
    const { brand, model, year, part_type, price_min, price_max } = state.filters;
    return brand || model || year || part_type !== 'original' || price_min || price_max;
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    const { brand, model, year, part_type, price_min, price_max } = state.filters;

    if (brand) activeFilters.push(`Brand: ${brand}`);
    if (model) activeFilters.push(`Model: ${model}`);
    if (year) activeFilters.push(`Year: ${year}`);
    if (part_type !== 'original') activeFilters.push(`Type: ${part_type}`);
    if (price_min) activeFilters.push(`Min Price: $${price_min}`);
    if (price_max) activeFilters.push(`Max Price: $${price_max}`);

    return activeFilters;
  };

  const value = {
    ...state,
    fetchProducts,
    searchProducts,
    setFilters,
    clearFilters,
    setSortBy,
    setCurrentPage,
    resetSearch,
    hasActiveFilters,
    getFilterSummary,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Products hook
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export default ProductsContext;