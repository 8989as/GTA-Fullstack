import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context';
import { PageHeader } from '../components';

const OrdersPage = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: '/' },
    { text: language === 'ar' ? 'طلباتي' : 'My Orders' }
  ];

  useEffect(() => {
    // TODO: Fetch orders from API
    // For now, using mock data
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          reference: 'ORD-001',
          status: 'pending',
          total: '$150.00',
          created_at: '2024-01-15',
          items: [
            { name: 'Brake Pads', quantity: 2, price: '$75.00' }
          ]
        },
        {
          id: 2,
          reference: 'ORD-002',
          status: 'completed',
          total: '$89.99',
          created_at: '2024-01-10',
          items: [
            { name: 'Oil Filter', quantity: 1, price: '$29.99' },
            { name: 'Air Filter', quantity: 1, price: '$60.00' }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'warning', text: language === 'ar' ? 'قيد المعالجة' : 'Pending' },
      processing: { class: 'info', text: language === 'ar' ? 'قيد التحضير' : 'Processing' },
      shipped: { class: 'primary', text: language === 'ar' ? 'تم الشحن' : 'Shipped' },
      completed: { class: 'success', text: language === 'ar' ? 'مكتمل' : 'Completed' },
      cancelled: { class: 'danger', text: language === 'ar' ? 'ملغي' : 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
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

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={language === 'ar' ? 'طلباتي' : 'My Orders'}
        breadcrumbs={breadcrumbs}
        image="/assets/images/page-header.png"
        alt="Orders Header"
      />

      <div className="container py-5">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-bag-x display-1 text-muted mb-4"></i>
            <h3 className="mb-3">
              {language === 'ar' ? 'لا يوجد طلبات' : 'No Orders Found'}
            </h3>
            <p className="text-muted mb-4">
              {language === 'ar'
                ? 'لم تقم بأي طلبات بعد. ابدأ التسوق الآن!'
                : "You haven't placed any orders yet. Start shopping now!"}
            </p>
            <a href="/products" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </a>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{language === 'ar' ? 'طلباتي' : 'My Orders'}</h2>
              <span className="text-muted">
                {orders.length} {language === 'ar' ? 'طلب' : 'orders'}
              </span>
            </div>

            <div className="row">
              {orders.map((order) => (
                <div key={order.id} className="col-12 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">
                          {language === 'ar' ? 'طلب رقم:' : 'Order:'} #{order.reference}
                        </h6>
                        <small className="text-muted">
                          {language === 'ar' ? 'تاريخ الطلب:' : 'Placed on:'} {new Date(order.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="text-end">
                        {getStatusBadge(order.status)}
                        <div className="fw-bold text-primary mt-1">{order.total}</div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="mb-3">{language === 'ar' ? 'المنتجات:' : 'Items:'}</h6>
                          {order.items.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between mb-2">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-muted">{item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="col-md-4 text-end">
                          <div className="d-flex flex-column gap-2">
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="bi bi-eye me-2"></i>
                              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            </button>

                            {order.status === 'completed' && (
                              <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-arrow-repeat me-2"></i>
                                {language === 'ar' ? 'إعادة الطلب' : 'Reorder'}
                              </button>
                            )}

                            {(order.status === 'pending' || order.status === 'processing') && (
                              <button className="btn btn-outline-danger btn-sm">
                                <i className="bi bi-x-circle me-2"></i>
                                {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination would go here if needed */}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;