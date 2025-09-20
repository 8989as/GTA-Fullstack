import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage, useProducts, useCart } from '../context';
import { ProductService } from '../services';
import { PageHeader } from '../components';

const ProductDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const result = await ProductService.getProduct(slug);

    if (result.success) {
      setProduct(result.data);
      setError(null);
    } else {
      setError(result.error);
      setProduct(null);
    }

    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product || !product.variants?.[0]) return;

    const result = await addToCart(product.variants[0].id, quantity);

    if (result.success) {
      setAddToCartMessage(language === 'ar' ? 'تم إضافة المنتج للسلة بنجاح' : 'Product added to cart successfully');
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: '/' },
    { text: language === 'ar' ? 'قطع الغيار' : 'Products', link: '/products' },
    { text: product?.name || (language === 'ar' ? 'تفاصيل المنتج' : 'Product Details') }
  ];

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

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-4">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h2>
          <p className="text-muted">
            {error || (language === 'ar' ? 'المنتج المطلوب غير متوفر' : 'The requested product is not available')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={product.name}
        breadcrumbs={breadcrumbs}
        image="/assets/images/page-header.png"
        alt="Product Header"
      />

      <div className="container py-5">
        {addToCartMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {addToCartMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAddToCartMessage('')}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="product-image">
              <img
                src={product.thumbnail || '/assets/images/placeholder-product.jpg'}
                alt={product.name}
                className="img-fluid rounded"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="product-details">
              <h1 className="mb-3">{product.name}</h1>

              {product.description && (
                <div className="mb-4">
                  <h5>{language === 'ar' ? 'الوصف' : 'Description'}</h5>
                  <p className="text-muted">{product.description}</p>
                </div>
              )}

              {product.variants?.[0] && (
                <div className="mb-4">
                  <h4 className="text-primary mb-3">
                    {product.variants[0].price?.formatted || 'Price not available'}
                  </h4>

                  <div className="d-flex align-items-center gap-3 mb-4">
                    <label htmlFor="quantity" className="form-label mb-0">
                      {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                  >
                    {cartLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {language === 'ar' ? 'جاري الإضافة...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Product attributes */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="product-attributes">
                  <h5 className="mb-3">{language === 'ar' ? 'المواصفات' : 'Specifications'}</h5>
                  <div className="row">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="col-sm-6 mb-2">
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;