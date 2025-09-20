import React, { useEffect, useState } from 'react';
import { useProducts, useCart, useLanguage } from '../../../context';
import './Products.css';

const ProductCard = ({ product, language }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get the first variant for add to cart functionality
  const defaultVariant = product.variants?.[0];
  const primaryImage = product.images?.[0];
  
  // Calculate discount percentage if original price exists
  const discount = defaultVariant?.compare_at_price && defaultVariant?.price 
    ? Math.round(((defaultVariant.compare_at_price - defaultVariant.price) / defaultVariant.compare_at_price) * 100)
    : null;

  const handleAddToCart = async () => {
    if (!defaultVariant) {
      console.error('No variant available for product:', product.name);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(defaultVariant.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = !defaultVariant || defaultVariant.stock <= 0;

  return (
    <div className="product-card">
      <div className="card h-100">
        {/* Product Image Section */}
        <div className="product-image-section position-relative">
          <div className="bg-light rounded-top p-3 text-center">
            <img 
              src={primaryImage?.url || 'https://placehold.co/116x136'} 
              alt={product.name} 
              className="product-image img-fluid" 
              style={{ maxHeight: '136px' }} 
            />
          </div>
          
          {/* Discount Badge */}
          {discount && (
            <div className="discount-badge">
              {language === 'ar' ? `خصم ${discount}%` : `${discount}% OFF`}
            </div>
          )}
          
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="out-of-stock-badge">
              {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn favorite-btn" aria-label="Add to favorites">
              <i className="bi bi-heart"></i>
            </button>
            <button className="action-btn preview-btn" aria-label="Quick preview">
              <i className="bi bi-eye"></i>
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="card-body d-flex flex-column">
          <div className="product-info mb-3">
            <small className="product-category text-muted mb-2 d-block">
              {product.category || (language === 'ar' ? 'قطع غيار' : 'Spare Parts')}
            </small>
            <h3 className="product-title text-primary">{product.name}</h3>
            <p className="product-description text-secondary mb-3">
              {product.description || (language === 'ar' ? 'لوريم ايبسوم هو نموذج افتراضي يوض...' : 'Lorem ipsum dolor sit amet...')}
            </p>
          </div>

          <div className="product-footer mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="brand-logo-wrapper p-3 bg-light rounded">
                <img 
                  src={product.brand?.logo || '/assets/images/brands/default-brand.png'} 
                  alt={product.brand?.name || 'Brand'} 
                  className="brand-logo" 
                />
              </div>
              <div className="product-price text-end">
                {defaultVariant?.compare_at_price && (
                  <span className="original-price text-muted text-decoration-line-through me-2">
                    {defaultVariant.formatted_compare_at_price}
                  </span>
                )}
                <span className="price-value">
                  {defaultVariant?.formatted_price || '$0.00'}
                </span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary w-100 add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart || cartLoading}
            >
              {isAddingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {language === 'ar' ? 'جاري الإضافة...' : 'Adding...'}
                </>
              ) : isOutOfStock ? (
                <>
                  <i className="bi bi-x-circle me-2"></i>
                  {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ pagination, onPageChange, language }) => {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page } = pagination;
  const pages = [];
  
  // Generate page numbers
  const startPage = Math.max(1, current_page - 2);
  const endPage = Math.min(last_page, current_page + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Products pagination">
        <ul className="pagination">
          {current_page > 1 && (
            <li className="page-item">
              <button 
                className="page-link" 
                onClick={() => onPageChange(current_page - 1)}
                aria-label={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
              >
                <i className={`bi bi-chevron-${language === 'ar' ? 'right' : 'left'}`}></i>
              </button>
            </li>
          )}
          
          {pages.map(page => (
            <li key={page} className={`page-item ${page === current_page ? 'active' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          
          {current_page < last_page && (
            <li className="page-item">
              <button 
                className="page-link" 
                onClick={() => onPageChange(current_page + 1)}
                aria-label={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
              >
                <i className={`bi bi-chevron-${language === 'ar' ? 'left' : 'right'}`}></i>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

const LoadingSpinner = ({ language }) => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">
        {language === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
      </p>
    </div>
  </div>
);

const NoProducts = ({ language, isSearchResults, searchQuery }) => (
  <div className="text-center py-5">
    <i className="bi bi-search display-1 text-muted mb-3"></i>
    <h4 className="text-muted mb-3">
      {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
    </h4>
    {isSearchResults && searchQuery && (
      <p className="text-muted">
        {language === 'ar' 
          ? `لا توجد نتائج للبحث عن "${searchQuery}"`
          : `No results found for "${searchQuery}"`
        }
      </p>
    )}
    <p className="text-muted">
      {language === 'ar' 
        ? 'جرب تغيير معايير البحث أو المرشحات'
        : 'Try adjusting your search criteria or filters'
      }
    </p>
  </div>
);

const Products = ({ language = 'ar' }) => {
  const { 
    products, 
    loading, 
    error, 
    pagination, 
    isSearchResults, 
    searchQuery,
    setCurrentPage,
    hasActiveFilters,
    getFilterSummary 
  } = useProducts();
  
  const { language: contextLanguage } = useLanguage();
  const currentLanguage = language || contextLanguage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of products section
    document.querySelector('.products-grid')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner language={currentLanguage} />;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="products-grid">
      {/* Results Summary */}
      {(isSearchResults || hasActiveFilters()) && (
        <div className="results-summary mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">
                {pagination?.total 
                  ? (currentLanguage === 'ar' 
                      ? `${pagination.total} منتج` 
                      : `${pagination.total} products`)
                  : (currentLanguage === 'ar' ? 'المنتجات' : 'Products')
                }
              </h5>
              {isSearchResults && searchQuery && (
                <small className="text-muted">
                  {currentLanguage === 'ar' 
                    ? `نتائج البحث عن "${searchQuery}"`
                    : `Search results for "${searchQuery}"`
                  }
                </small>
              )}
              {hasActiveFilters() && (
                <div className="mt-2">
                  <small className="text-muted">
                    {currentLanguage === 'ar' ? 'المرشحات النشطة: ' : 'Active filters: '}
                  </small>
                  {getFilterSummary().map((filter, index) => (
                    <span key={index} className="badge bg-secondary me-1">
                      {filter}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {loading && products.length > 0 && (
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <NoProducts 
          language={currentLanguage} 
          isSearchResults={isSearchResults} 
          searchQuery={searchQuery} 
        />
      ) : (
        <>
          <div className="container">
            <div className="row g-4">
              {products.map(product => (
                <div key={product.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard product={product} language={currentLanguage} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination */}
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
            language={currentLanguage} 
          />
        </>
      )}
    </div>
  );
};

export default Products;