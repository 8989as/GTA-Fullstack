import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = ({ language = "ar" }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    contactReason: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div
      className="contact-form-section"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="row g-4 justify-content-end">
        {/* Form Section */}
        <div className="col-lg-6 order-lg-1">
          <div className="contact-form-wrapper">
            <div className="contact-form-header mb-4">
              <h2 className="contact-form-title">رسالتك تهمنا!</h2>
              <p className="contact-form-subtitle">
                عبّ النموذج تحت وخلك مطمّن، أحد أعضاء فريقنا بيتواصل معك بأقرب
                وقت ممكن.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      الإسم
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="أكتب إسمك كاملاً"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="أكتب رقم الجوال"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      البريد الإلكترونى
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="أكتب البريد الإلكترونى"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="contactReason" className="form-label">
                      سبب التواصل
                    </label>
                    <select
                      className="form-select"
                      id="contactReason"
                      name="contactReason"
                      value={formData.contactReason}
                      onChange={handleChange}
                    >
                      <option value="">أكتب سبب التواصل</option>
                      <option value="inquiry">استفسار عام</option>
                      <option value="service">طلب خدمة</option>
                      <option value="complaint">شكوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="message" className="form-label">
                  الرسالة
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="أكتب رسالتك او إستفسارك هنا..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-button">
                إرسال
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="col-lg-6 order-lg-2">
          <div className="contact-info-wrapper">
            <div className="contact-info-header mb-4">
              <h2 className="contact-info-title">خلّنا على تواصل!</h2>
              <p className="contact-info-subtitle">
                لو عندك سؤال، تحتاج مساعدة، أو ودك تعرف أكثر عن خدماتنا؟ تواصل
                معنا بأي وقت، وراح نكون بانتظارك.
              </p>
            </div>

            <div className="contact-info-items">
              <div className="contact-info-item mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="contact-icon-wrapper">
                    <img src="assets/images/phone.svg" alt="Phone Icon" />
                  </div>
                  <div className="contact-item-content">
                    <h3 className="contact-item-title">التليفون</h3>
                    <p className="contact-item-text">
                      013 845 7733 - 013 845 7722
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-info-item mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="contact">
                    <img src="assets/images/email.svg" alt="Email Icon" />
                  </div>
                  <div className="contact-item-content">
                    <h3 className="contact-item-title">البريد الإلكترونى</h3>
                    <p className="contact-item-text">info@gtaksa.com</p>
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <h3 className="contact-item-title mb-3">تابعنا على :</h3>
                <div className="social-icons d-flex gap-3">
                  <a href="#" className="social-icon">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
