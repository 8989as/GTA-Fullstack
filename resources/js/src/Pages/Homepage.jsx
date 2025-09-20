import React from "react";
import {
  Header,
  LogoSlider,
  Services,
  SpeedometerDashboard,
  Steps,
  HMRTest,
  APITest
} from "../components";

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
      <Header />
      <HMRTest />
      <APITest />
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