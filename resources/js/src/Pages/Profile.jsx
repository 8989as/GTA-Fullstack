import React from 'react';
import { useLanguage, useAuth } from '../context';
import PageHeader from '../components/PageHeader/PageHeader';

const ProfilePage = () => {
  const { language } = useLanguage();
  const { user, logout } = useAuth();

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: '/' },
    { text: language === 'ar' ? 'الملف الشخصي' : 'Profile' }
  ];

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={language === 'ar' ? 'الملف الشخصي' : 'My Profile'}
        breadcrumbs={breadcrumbs}
        image="/assets/images/page-header.png"
        alt="Profile Header"
      />
      
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-person-circle display-1 text-muted"></i>
                </div>
                <h5 className="card-title">{user?.name}</h5>
                <p className="card-text text-muted">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">{language === 'ar' ? 'معلومات الحساب' : 'Account Information'}</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong>
                  </div>
                  <div className="col-sm-9">
                    {user?.name}
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong>
                  </div>
                  <div className="col-sm-9">
                    {user?.email}
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>{language === 'ar' ? 'تاريخ التسجيل:' : 'Member Since:'}</strong>
                  </div>
                  <div className="col-sm-9">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                
                <hr />
                
                <div className="d-flex gap-2">
                  <button className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>
                    {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-key me-2"></i>
                    {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-grid">
                      <a href="/orders" className="btn btn-outline-primary">
                        <i className="bi bi-bag me-2"></i>
                        {language === 'ar' ? 'طلباتي' : 'My Orders'}
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-grid">
                      <a href="/cart" className="btn btn-outline-primary">
                        <i className="bi bi-cart me-2"></i>
                        {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
                      </a>
                    </div>
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

export default ProfilePage;