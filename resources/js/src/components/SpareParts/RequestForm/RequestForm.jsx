import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    carType: '',
    carModel: '',
    partName: '',
    notes: ''
  });

  const carModels = {
    bmw: ["X1", "X3", "X5", "X7", "3 Series", "5 Series", "7 Series"],
    mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE"],
    audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      // Reset car model when car type changes
      ...(name === 'carType' && { carModel: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const t = {
    title: 'ما لقيت القطعة اللي تدورها؟ خلينا نساعدك!',
    subtitle: 'بعض القطع ما تكون متوفرة أونلاين، بس نقدر نوفرها لك بأسرع وقت ممكن. عبّي النموذج تحت، وخل فريقنا يتواصل معك مباشرة.',
    name: 'الإسم',
    namePlaceholder: 'أكتب إسمك كاملاً',
    phone: 'رقم الجوال',
    phonePlaceholder: 'أكتب رقم الجوال',
    email: 'البريد الإلكترونى',
    emailPlaceholder: 'أكتب البريد الإلكترونى',
    carType: 'نوع السيارة',
    carTypePlaceholder: 'أختر نوع السيارة',
    carModel: 'موديل السيارة',
    carModelPlaceholder: 'أختر موديل السيارة',
    partName: 'إسم قطعة الغيار',
    partNamePlaceholder: 'أكتب إسم قطعة الغيار',
    notes: 'ملاحظات إضافية',
    notesPlaceholder: 'أكتب ملاحظات إضافية تريد فريق GTA أن يعرفها',
    submit: 'إرسال الطلب'
  };

  return (
    <div className="request-form-section" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="row g-0">
        <div className="col-md-6">
          <img 
            src="https://placehold.co/628x740" 
            alt="Request Form" 
            className="img-fluid h-100 rounded-start" 
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <div className="request-form-content">
            <h2 className="form-title">{t.title}</h2>
            <p className="form-subtitle">{t.subtitle}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-sm-6">
                  <label htmlFor="name" className="form-label">{t.name}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="phone" className="form-label">{t.phone}</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label htmlFor="email" className="form-label">{t.email}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="carType" className="form-label">{t.carType}</label>
                  <select
                    className="form-select"
                    id="carType"
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                  >
                    <option value="">{t.carTypePlaceholder}</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label htmlFor="carModel" className="form-label">{t.carModel}</label>
                  <select
                    className="form-select"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    disabled={!formData.carType}
                  >
                    <option value="">{t.carModelPlaceholder}</option>
                    {formData.carType && carModels[formData.carType]?.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="partName" className="form-label">{t.partName}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="partName"
                    name="partName"
                    placeholder={t.partNamePlaceholder}
                    value={formData.partName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="notes" className="form-label">{t.notes}</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  placeholder={t.notesPlaceholder}
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="submit-button">
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;