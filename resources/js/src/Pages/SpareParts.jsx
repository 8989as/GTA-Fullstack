import React from "react";
import { useLanguage } from "../context";
import Navbar from "../components/Navbar/Navbar";
import PageHeader from "../components/PageHeader/PageHeader";
import Sidebar from "../components/SpareParts/Sidebar/Sidebar";
import Products from "../components/SpareParts/Products/Products";
import RequestForm from "../components/SpareParts/RequestForm/RequestForm";

const SpareParts = () => {
  const { language } = useLanguage();
  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: "/" }, 
    { text: language === 'ar' ? 'قطع الغيار' : 'Spare Parts' }
  ];

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <Navbar />
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
