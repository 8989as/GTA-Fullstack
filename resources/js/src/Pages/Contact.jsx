import React from "react";
import { useLanguage } from "../context";
import { PageHeader, ContactForm, BranchMap } from "../components";

const Contact = () => {
  const { language } = useLanguage();

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: "/" },
    { text: language === 'ar' ? 'تواصل معنا' : 'Contact Us' }
  ];

  return (
    <>
      <PageHeader
        title={language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        breadcrumbs={breadcrumbs}
        image="assets/images/page-header.png"
        alt="Contact Us Header"
      />
      <div className="container py-5">
        <ContactForm />
        <BranchMap />
      </div>
    </>
  );
};

export default Contact;