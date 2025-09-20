import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Header from "../components/HomePage/Header/Header";
import LogoSlider from '../components/HomePage/LogoSlider/LogoSlider';
import Services from "../components/HomePage/Services/Services";
// import Reviews from "../components/HomePage/Reviews/Reviews";
import SpeedometerDashboard from "../components/HomePage/Speedometer/Speedometer";
import Steps from "../components/HomePage/Steps/Steps";

const Homepage = () => {
  const BrandLogos = [
    '/assets/images/brands/brand-1.svg',
    '/assets/images/brands/brand-2.svg',
    '/assets/images/brands/brand-3.svg',
    '/assets/images/brands/brand-4.svg',
    '/assets/images/brands/brand-5.svg'
  ];

  const PartnersLogos = [
    '/assets/images/partners/partener-1.jpg',
    '/assets/images/partners/partener-2.jpg',
    '/assets/images/partners/partener-3.jpg',
    '/assets/images/partners/partener-4.jpg'
  ];

  return (
    <div>
      <Navbar />
      <Header />
      <LogoSlider logos={BrandLogos} interval={3000} itemsPerSlide={3} />
      <Services />
      {/* <Reviews /> */}
      <LogoSlider logos={PartnersLogos} interval={3000} itemsPerSlide={3} />
      <SpeedometerDashboard />
      <Steps />
    </div>
  );
};

export default Homepage;