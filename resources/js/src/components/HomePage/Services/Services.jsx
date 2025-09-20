import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services-section container py-5">
      <h2 className="text-center service-title mb-5">خدماتنا المميزة</h2>
      
      {/* First row with 2 equal columns */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="service-card">
            <img src="https://placehold.co/628x421" className="img-fluid" alt="German Car Modification" />
            <div className="overlay"></div>
            <div className="service-content">
              <h3>تعديل السيارات الألمانية</h3>
              <p>نقدم خدمات احترافية في تعديل وتحسين أداء السيارات الألمانية مع الحفاظ على جودتها وموثوقيتها</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="service-card">
            <img src="https://placehold.co/629x422" className="img-fluid" alt="Car Maintenance" />
            <div className="overlay"></div>
            <div className="service-content">
              <h3>صيانة السيارات</h3>
              <p>لوريم ايبسوم هو نموذج افتراضي يوضع في التصاميم لتعرض على العميل ليتصور طريقه وضع النصوص بالتصاميم سواء كانت تصاميم مطبوعه</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second row with 3 equal columns */}
      <div className="row">
        <div className="col-md-4">
          <div className="service-card">
            <img src="https://placehold.co/411x422" className="img-fluid" alt="Corporate Projects" />
            <div className="overlay"></div>
            <div className="service-content">
              <h3>مشاريع الشركات</h3>
              <p>نوفر حلول متكاملة لمشاريع الشركات مع خدمات صيانة وإدارة أساطيل السيارات</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="service-card">
            <img src="https://placehold.co/411x422" className="img-fluid" alt="Government Projects" />
            <div className="overlay"></div>
            <div className="service-content">
              <h3>المشاريع الحكومية</h3>
              <p>خبرة واسعة في تنفيذ المشاريع الحكومية وتقديم خدمات الصيانة للمؤسسات العامة</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="service-card">
            <img src="https://placehold.co/411x422" className="img-fluid" alt="Spare Parts" />
            <div className="overlay"></div>
            <div className="service-content">
              <h3>قطع غيار</h3>
              <p>توفير قطع غيار أصلية وعالية الجودة لجميع أنواع السيارات مع ضمان موثوقية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;