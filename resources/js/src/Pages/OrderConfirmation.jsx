import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage, useAuth } from '../context';
import { OrderService } from '../services';
import PageHeader from '../components/PageHeader/PageHeader';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: '/' },
    { text: language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrder = async () => {
    setLoading(true);
    const result = await OrderService.getOrder(orderId);
    
    if (result.success) {
      setOrder(result.data);
      setError(null);
    } else {
      setError(result.error);
      setOrder(null);
    }
    
    setLoading(false);
  };

  const handleDownloadInvoice = async () => {
    const result = await OrderService.getOrderInvoice(orderId);
    
    if (result.success) {
      // Create blob and download
      const blob = new Blob([result.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'warning', text: language === 'ar' ? 'قيد المعالجة' : 'Pending' },
      processing: { class: 'info', text: language === 'ar' ? 'قيد التحضير' : 'Processing' },
      shipped: { class: 'primary', text: language === 'ar' ? 'تم الشحن' : 'Shipped' },
      delivered: { class: 'success', text: language === 'ar' ? 'تم التسليم' : 'Delivered' },
      cancelled: { class: 'danger', text: language === 'ar' ? 'ملغي' : 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge bg-${config.class} fs-6`}>{config.text}</span>;
  };

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

  if (error || !order) {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <PageHeader
          title={language === 'ar' ? 'خطأ' : 'Error'}
          breadcrumbs={breadcrumbs}
          image="/assets/images/page-header.png"
          alt="Error Header"
        />
        
        <div className="container py-5">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-danger display-1 mb-4"></i>
            <h3 className="mb-3">
              {language === 'ar' ? 'لم يتم العثور على الطلب' : 'Order Not Found'}
            </h3>
            <p className="text-muted mb-4">
              {error || (language === 'ar' 
                ? 'الطلب المطلوب غير موجود أو تم حذفه'
                : 'The requested order does not exist or has been removed')}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/orders')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              {language === 'ar' ? 'العودة للطلبات' : 'Back to Orders'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation'}
        breadcrumbs={breadcrumbs}
        image="/assets/images/page-header.png"
        alt="Order Confirmation Header"
      />
      
      <div className="container py-5">
        {/* Success Message */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-success">
              <div className="card-body text-center py-5">
                <i className="bi bi-check-circle text-success display-1 mb-4"></i>
                <h2 className="text-success mb-3">
                  {language === 'ar' ? 'تم إتمام طلبك بنجاح!' : 'Order Placed Successfully!'}
                </h2>
                <p className="text-muted fs-5 mb-4">
                  {language === 'ar' 
                    ? 'شكراً لك على طلبك. سيتم التواصل معك قريباً لتأكيد التفاصيل.'
                    : 'Thank you for your order. We will contact you soon to confirm the details.'}
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/orders')}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    {language === 'ar' ? 'عرض جميع الطلبات' : 'View All Orders'}
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleDownloadInvoice}
                  >
                    <i className="bi bi-download me-2"></i>
                    {language === 'ar' ? 'تحميل الفاتورة' : 'Download Invoice'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
                </h5>
                {getStatusBadge(order.status)}
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">
                      {language === 'ar' ? 'رقم الطلب:' : 'Order Number:'}
                    </h6>
                    <p className="fw-bold">{order.reference}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">
                      {language === 'ar' ? 'تاريخ الطلب:' : 'Order Date:'}
                    </h6>
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Order Items */}
                <h6 className="mb-3">
                  {language === 'ar' ? 'المنتجات المطلوبة:' : 'Ordered Items:'}
                </h6>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead className="table-light">
                      <tr>
                        <th>{language === 'ar' ? 'المنتج' : 'Product'}</th>
                        <th className="text-center">{language === 'ar' ? 'الكمية' : 'Quantity'}</th>
                        <th className="text-end">{language === 'ar' ? 'السعر' : 'Price'}</th>
                        <th className="text-end">{language === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.lines?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.purchasable?.thumbnail && (
                                <img 
                                  src={item.purchasable.thumbnail} 
                                  alt={item.purchasable.name}
                                  className="order-item-image me-3"
                                />
                              )}
                              <div>
                                <h6 className="mb-1">{item.purchasable?.name}</h6>
                                {item.purchasable?.sku && (
                                  <small className="text-muted">SKU: {item.purchasable.sku}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{item.unit_price?.formatted}</td>
                          <td className="text-end fw-bold">{item.total?.formatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
                  </h6>
                </div>
                <div className="card-body">
                  <address className="mb-0">
                    <strong>{order.shipping_address.first_name} {order.shipping_address.last_name}</strong><br />
                    {order.shipping_address.line_one}<br />
                    {order.shipping_address.line_two && (
                      <>{order.shipping_address.line_two}<br /></>
                    )}
                    {order.shipping_address.city}, {order.shipping_address.postcode}<br />
                    {order.shipping_address.country}
                  </address>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span>{order.sub_total?.formatted}</span>
                </div>
                
                {order.tax_total && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>{language === 'ar' ? 'الضريبة:' : 'Tax:'}</span>
                    <span>{order.tax_total.formatted}</span>
                  </div>
                )}
                
                {order.shipping_total && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>{language === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                    <span>{order.shipping_total.formatted}</span>
                  </div>
                )}
                
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</strong>
                  <strong className="text-primary fs-5">{order.total?.formatted}</strong>
                </div>
                
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">
                    <i className="bi bi-credit-card me-2"></i>
                    {language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'} 
                    <span className="ms-1">
                      {order.payment_method === 'cash_on_delivery' 
                        ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
                        : order.payment_method
                      }
                    </span>
                  </small>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card mt-4">
              <div className="card-header">
                <h6 className="mb-0">
                  {language === 'ar' ? 'الخطوات التالية' : 'What\'s Next?'}
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-telephone text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">
                      {language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation'}
                    </h6>
                    <small className="text-muted">
                      {language === 'ar' 
                        ? 'سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب'
                        : 'We will contact you within 24 hours to confirm your order'}
                    </small>
                  </div>
                </div>
                
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-box-seam text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">
                      {language === 'ar' ? 'تحضير الطلب' : 'Order Preparation'}
                    </h6>
                    <small className="text-muted">
                      {language === 'ar' 
                        ? 'سيتم تحضير طلبك وتجهيزه للشحن'
                        : 'Your order will be prepared and packaged for shipping'}
                    </small>
                  </div>
                </div>
                
                <div className="d-flex align-items-start">
                  <i className="bi bi-truck text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">
                      {language === 'ar' ? 'الشحن والتسليم' : 'Shipping & Delivery'}
                    </h6>
                    <small className="text-muted">
                      {language === 'ar' 
                        ? 'سيتم شحن طلبك وتسليمه في الموعد المحدد'
                        : 'Your order will be shipped and delivered as scheduled'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;