import React from "react";
import { useLanguage } from "../context";
import { PageHeader, Sidebar, Products, RequestForm } from "../components";

const SpareParts = () => {
  const { language } = useLanguage();
  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: "/" },
    { text: language === 'ar' ? 'قطع الغيار' : 'Spare Parts' }
  ];

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <PageHeader
        title={language === 'ar' ? 'قطع الغيار' : 'Spare Parts'}
        breadcrumbs={breadcrumbs}
        image="assets/images/page-header.png"
        alt="Page Header"
      />
      <div className="container-fluid py-5">
        <div className="row">
          <div className={`col-lg-3 ${language === "ar" ? "order-2" : ""}`}>
            <Sidebar language={language} />
          </div>
          <div className={`col-lg-9 ${language === "ar" ? "order-1" : ""}`}>
            <Products language={language} />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <RequestForm language={language} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpareParts;
