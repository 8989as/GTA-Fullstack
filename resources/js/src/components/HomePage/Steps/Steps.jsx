import React from 'react';
import './Steps.css';

const Steps = () => {
  return (
    <div className="steps-section container-fluid py-5">
      <h2 className="text-center steps-title mb-5">
        وشلون نشتغل؟ كل شي بخطوات واضحة وسريعة
      </h2>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
        {/* Step 1 */}
        <div className="col">
          <div className="card step-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="step-header mb-4 text-end">
                <p className="step-number mb-1">الخطوة الأولى</p>
                <h3 className="step-title">نستلم السيارة</h3>
              </div>
              <p className="step-description text-end">
                أول ما توصلنا، نستلم سيارتك ونسجّل كل التفاصيل اللي تحتاجها
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="col">
          <div className="card step-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="step-header mb-4 text-end">
                <p className="step-number mb-1">الخطوة الثانية</p>
                <h3 className="step-title">نفحصها مضبوط</h3>
              </div>
              <p className="step-description text-end">
                نسوي فحص شامل ونشخّص المشكلة بأحدث الأجهزة
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="col">
          <div className="card step-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="step-header mb-4 text-end">
                <p className="step-number mb-1">الخطوة الثالثة</p>
                <h3 className="step-title">نعطيك العلم</h3>
              </div>
              <p className="step-description text-end">
                نشرح لك كل شي بنشتغل عليه، وتكلفة الخدمة، وإذا وافقت نبدأ الشغل
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="col">
          <div className="card step-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="step-header mb-4 text-end">
                <p className="step-number mb-1">الخطوة الرابعة</p>
                <h3 className="step-title">نبدأ <br/>الشغل</h3>
              </div>
              <p className="step-description text-end">
                فريقنا يشتغل على سيارتك بكل احترافية واهتمام بأدق التفاصيل
              </p>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="col">
          <div className="card step-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="step-header mb-4 text-end">
                <p className="step-number mb-1">الخطوة الخامسة</p>
                <h3 className="step-title">نسلّمها لك جاهزة</h3>
              </div>
              <p className="step-description text-end">
                بعد ما نخلص، نسلّمك السيارة نظيفة ومضبوطة، ونشرح لك كل اللي سويناه
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;