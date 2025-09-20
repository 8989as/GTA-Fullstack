import React from "react";
import Navbar from "../components/Navbar/Navbar";
import PageHeader from "../components/PageHeader/PageHeader";
import SectionOne from '../components/About/SectionOne/SectionOne';
import SectionTwo from "../components/About/SectionTwo/SectionTwo";
import SectionThree from "../components/About/SectionThree/SectionThree";
import BranchesSection from "../components/About/Branches/Branches";


const About = () => {
  const breadcrumbs = [
    { text: "الرئيسية", link: "/" },
    { text: "من نحن" }
  ];

  return (
    <>
      <Navbar />
      <PageHeader
        title="من نحن"
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
