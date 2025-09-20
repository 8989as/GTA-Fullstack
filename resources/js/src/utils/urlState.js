/**
 * URL State Management Utilities
 * Handles filter state persistence in URL query parameters
 */

export const useURLParams = () => {
  // Get current URL search params
  const getURLParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlParams.entries());
  };

  // Update URL with new parameters
  const updateURLParams = (params, replace = false) => {
    const url = new URL(window.location);
    
    // Clear existing params if replacing
    if (replace) {
      url.search = '';
    }
    
    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    
    // Update browser history without reload
    window.history.pushState({}, '', url);
  };

  // Clear specific parameters
  const clearURLParams = (keys) => {
    const url = new URL(window.location);
    keys.forEach(key => url.searchParams.delete(key));
    window.history.pushState({}, '', url);
  };

  // Clear all parameters
  const clearAllURLParams = () => {
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);
  };

  return {
    getURLParams,
    updateURLParams,
    clearURLParams,
    clearAllURLParams,
  };
};

// Helper to parse filters from URL
export const parseFiltersFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    brand: params.get('brand') || '',
    model: params.get('model') || '',
    year: params.get('year') || '',
    part_type: params.get('part_type') || 'original',
    price_min: params.get('price_min') || '',
    price_max: params.get('price_max') || '',
    q: params.get('q') || '', // search query
    page: parseInt(params.get('page')) || 1,
  };
};

// Helper to build URL from filters
export const buildURLFromFilters = (filters, searchQuery = '') => {
  const params = new URLSearchParams();
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'original') {
      params.set(key, value);
    }
  });
  
  // Add search query
  if (searchQuery && searchQuery.trim()) {
    params.set('q', searchQuery.trim());
  }
  
  return params.toString();
};