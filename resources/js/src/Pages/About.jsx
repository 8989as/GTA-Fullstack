import React from "react";
import { useLanguage } from "../context";
import {
  PageHeader,
  SectionOne,
  SectionTwo,
  SectionThree,
  BranchesSection
} from "../components";

const About = () => {
  const { language } = useLanguage();

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: "/" },
    { text: language === 'ar' ? 'من نحن' : 'About Us' }
  ];

  return (
    <>
      <PageHeader
        title={language === 'ar' ? 'من نحن' : 'About Us'}
        breadcrumbs={breadcrumbs}
        image="assets/images/page-header.png"
        alt="Page Header"
      />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <BranchesSection />
    </>
  );
};

export default About;
