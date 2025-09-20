import React from "react";
import Navbar from "../components/Navbar/Navbar";
import PageHeader from "../components/PageHeader/PageHeader";
import ContactForm from "../components/Contact/ContactForm";
import BranchMap from "../components/Contact/BranchMap";

const Contact = () => {
  const breadcrumbs = [
    { text: "الرئيسية", link: "/" },
    { text: "تواصل معنا" }
  ];

  return (
    <>
      <Navbar />
      <PageHeader
        title="تواصل معنا"
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