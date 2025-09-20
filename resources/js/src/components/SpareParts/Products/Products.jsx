import React from 'react';
import './Products.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="card h-100">
        {/* Product Image Section */}
        <div className="product-image-section position-relative">
          <div className="bg-light rounded-top p-3 text-center">
            <img src={product.image} alt={product.title} className="product-image img-fluid" style={{ maxHeight: '136px' }} />
          </div>
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="discount-badge">
              خصم {product.discount}%
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
            <small className="product-category text-muted mb-2 d-block">{product.category}</small>
            <h3 className="product-title text-primary">{product.title}</h3>
            <p className="product-description text-secondary mb-3">{product.description}</p>
          </div>

          <div className="product-footer mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="brand-logo-wrapper p-3 bg-light rounded">
                <img src={product.brandLogo} alt={product.brand} className="brand-logo" />
              </div>
              <div className="product-price text-end">
                <span className="price-value">{product.price}</span>
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
            
            <button className="btn btn-primary w-100 add-to-cart-btn">
              <i className="bi bi-cart-plus me-2"></i>
              أضف إلى السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const products = [
    {
      id: 1,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    },
    {
      id: 2,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    },
    {
      id: 3,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    },
    {
      id: 4,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    },
    {
      id: 5,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    },
    {
      id: 6,
      image: "https://placehold.co/116x136",
      title: "مكابح",
      category: "أنظمة المكابح",
      description: "لوريم ايبسوم هو نموذج افتراضي يوض...",
      price: 150,
      discount: 20,
      brand: "BMW",
      brandLogo: "/assets/images/brands/bmw-logo.png"
    }
  ];

  return (
    <div className="products-grid">
      <div className="container">
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-12 col-md-6 col-lg-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;