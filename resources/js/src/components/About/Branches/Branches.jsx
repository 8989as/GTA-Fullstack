import React from "react";
import "./Branches.css";

const BranchesSection = () => {
  return (
    <div className="branches-section py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#0D6EFD" }}>
          فروعنا في المملكة العربية السعودية
        </h2>

        <div className="row align-items-center">
          {/* Branch Info Column */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="branch-info">
              <div className="mb-4">
                <h3 className="fw-bold mb-3" style={{ color: "#0D6EFD" }}>
                  فرع الرياض - الفيصلية
                </h3>
                <div className="d-flex align-items-center">
                  <img
                    src="/assets/images/About/pin.svg"
                    alt="Location Icon"
                    className="location-icon"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <p className="mb-0 text-muted">
                    الصناعات، الثقبة، الخبر 34626، المملكة العربية السعودية
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row g-4">
                {/* Administrators Card */}
                <div className="col-3">
                  <div className="stat-card">
                    <img
                      src="/assets/images/About/branch-icon-4.svg"
                      alt="Administrators Icon"
                      className="fs-2 mb-3"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <p className="fw-medium">عدد الإداريين</p>
                    <p className="value">5</p>
                  </div>
                </div>

                {/* Technicians Card */}
                <div className="col-3">
                  <div className="stat-card">
                    <img
                      src="/assets/images/About/branch-icon-3.svg"
                      alt="Technicians Icon"
                      className="fs-2 mb-3"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <p className="fw-medium">عدد الفنيين</p>
                    <p className="value">28</p>
                  </div>
                </div>

                {/* Area Card */}
                <div className="col-3">
                  <div className="stat-card">
                    <img
                      src="/assets/images/About/branch-icon-2.svg"
                      alt="Area Icon"
                      className="fs-2 mb-3"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <p className="fw-medium">مساحة الفرع</p>
                    <p className="value">2600</p>
                  </div>
                </div>

                {/* Capacity Card */}
                <div className="col-3">
                  <div className="stat-card">
                    <img
                      src="/assets/images/About/branch-icon-1.svg"
                      alt="Capacity Icon"
                      className="fs-2 mb-3"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <p className="fw-medium">الطاقة الإستيعابية</p>
                    <p className="value">130</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Image Column */}
          <div className="col-lg-6">
            <div id="branchCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#branchCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#branchCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#branchCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="assets/images/About/branch1.png" className="d-block w-100 branch-image" alt="فرع الرياض - الفيصلية 1" />
                </div>
                <div className="carousel-item">
                  <img src="assets/images/About/branch2.png" className="d-block w-100 branch-image" alt="فرع الرياض - الفيصلية 2" />
                </div>
                <div className="carousel-item">
                  <img src="assets/images/About/branch3.png" className="d-block w-100 branch-image" alt="فرع الرياض - الفيصلية 3" />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#branchCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#branchCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchesSection;
