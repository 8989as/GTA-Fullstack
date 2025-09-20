import React from "react";
import "./SectionOne.css";

const SectionOne = () => {
  return (
    <section className="about-section-one">
      <div className="container py-5">
        <div className="row align-items-center justify-content-end">
          {/* Text Content */}
          <div className="col-lg-6 text-end">
            <div className="about-content">
              <h2 className="section-title mb-4">من نحن</h2>
              <p className="section-text">
                شركة التقنية الألمانية لخدمة السيارات هي واحدة من أبرز شركات
                الصيانة بالمنطقة الشرقية التي تضم خدمات السيارات الالمانية تحت
                سقف واحد نعد عملائنا بأن نقدم لهم أفضل الخدمات بأسعار تنافسية،
                كما نضمن كافة أعمالنا. ونحن نسعى دائما لتقديم أفضل خدمة عملاء
                يمكننا تقديمها لعملائنا.
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="col-lg-6">
            <div className="about-images">
              <div className="image-container primary">
                <img
                  src="assets/images/About/section1.png"
                  alt="About us primary"
                  className="primary-image"
                />
              </div>
              <div className="image-container secondary">
                <div className="shape-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
