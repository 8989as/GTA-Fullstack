import React from 'react';
import './SectionThree.css';

const SectionThree = () => {
  return (
    <section className="container section-three py-5">
      <div className="container-fluid px-4">
        <div className="row g-4 align-items-stretch">
          {/* First Column (c3) - Car Collection */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column h-100">
              <div className="mb-4 image-wrapper">
                <img 
                  className="img-fluid w-100 rounded-3 main-image" 
                  src="/assets/images/About/s3-c3-1.png" 
                  alt="Luxury car showroom" 
                />
              </div>
              <div className="row g-4">
                <div className="col-5">
                  <div className="image-wrapper">
                    <img 
                      className="img-fluid w-100 rounded-3" 
                      src="/assets/images/About/s3-c3-3.png" 
                      alt="Auto parts" 
                    />
                  </div>
                </div>
                <div className="col-7">
                  <div className="image-wrapper">
                    <img 
                      className="img-fluid w-100 rounded-3" 
                      src="/assets/images/About/s3-c3-2.png" 
                      alt="Car maintenance" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center Column (c2) - Featured Vehicle */}
          <div className="col-12 col-lg-4">
            <div className="center-image-wrapper h-100">
              <img 
                className="img-fluid w-100 h-100 rounded-3 object-fit-cover" 
                src="/assets/images/About/s3-c2.png" 
                alt="Premium vehicle showcase" 
              />
            </div>
          </div>
          
          {/* Last Column (c1) - Experience & Service */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column h-100">
              <div className="experience-box rounded-3 mb-4">
                <h2 className="experience-text mb-0">14 سنة<br/>من الخبرة</h2>
              </div>
              <div className="service-image-wrapper flex-grow-1">
                <img 
                  className="img-fluid w-100 h-100 rounded-3 object-fit-cover" 
                  src="/assets/images/About/s3-c1.png" 
                  alt="Professional service center" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionThree;