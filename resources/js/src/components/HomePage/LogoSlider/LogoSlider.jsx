import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import './LogoSlider.css';

const LogoSlider = ({ logos, interval = 3000, itemsPerSlide = 3 }) => {
  useEffect(() => {
    const carousel = new bootstrap.Carousel(document.getElementById('logoCarousel'), {
      interval: interval,
      wrap: true,
      ride: 'carousel'
    });

    return () => {
      carousel.dispose();
    };
  }, [interval]);

  const chunkLogos = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const logoGroups = chunkLogos(logos, itemsPerSlide);

  return (
    <div className="container my-5">
      <div id="logoCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {logoGroups.map((group, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="row justify-content-center align-items-center">
                {group.map((logo, logoIndex) => (
                  <div key={logoIndex} className="col-12 col-md-4 text-center">
                    <img
                      src={logo}
                      alt={`Brand logo ${logoIndex + 1}`}
                      className="img-fluid mx-auto"
                      style={{ maxHeight: '100px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#logoCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#logoCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default LogoSlider;