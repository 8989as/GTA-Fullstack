import React, { useState } from "react";
import { translations } from "./translations";
import "./Sidebar.css";

const Sidebar = ({ language = "en" }) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [partType, setPartType] = useState("original");

  const t = translations[language];

  const carBrands = [
    { id: "porsche", logo: "/assets/images/brands/porsche-logo.png" },
    { id: "lamborghini", logo: "/assets/images/brands/lamborghini-logo.png" },
    { id: "maserati", logo: "/assets/images/brands/maserati-logo.png" },
    { id: "audi", logo: "/assets/images/brands/audi-logo.png" },
    { id: "rolls", logo: "/assets/images/brands/rolls-royce-logo.png" },
    { id: "bmw", logo: "/assets/images/brands/bmw-logo.png" },
    { id: "bentley", logo: "/assets/images/brands/bentley-logo.png" },
    { id: "jaguar", logo: "/assets/images/brands/jaguar-logo.png" },
    { id: "mercedes", logo: "/assets/images/brands/mercedes-logo.png" },
  ];

  const carModels = {
    maserati: ["Grecale", "GranCabrio", "Mc20", "GT2 Stradale", "GranTurismo"],
    bmw: ["X1", "X3", "X5", "X7", "3 Series", "5 Series", "7 Series"],
    mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE"],
    audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"],
    // Add more models for other brands
  };

  const years = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
  ];

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel("");
  };

  const handleFilter = () => {
    // Handle filter logic here
    console.log({
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      partType,
    });
  };

  return (
    <div
      className="sidebar-filter p-4 bg-white rounded"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="filter-title mb-4">{t.filterProducts}</h2>

      {/* Car Brand Selection */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.carBrand}</h3>
        <div className="car-brands-grid">
          {carBrands.map((brand) => (
            <div
              key={brand.id}
              className={`car-brand-item ${
                selectedBrand === brand.id ? "selected" : ""
              }`}
              onClick={() => handleBrandSelect(brand.id)}
            >
              <img src={brand.logo} alt={brand.id} className="brand-logo" />
            </div>
          ))}
        </div>
      </div>

      {/* Car Model Selection */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.carModel}</h3>
        <select
          className="form-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">{t.selectModel}</option>
          {selectedBrand &&
            carModels[selectedBrand]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>
      </div>

      {/* Manufacturing Year */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.manufacturingYear}</h3>
        <div className="year-badges">
          {years.map((year) => (
            <span
              key={year}
              className={`year-badge ${
                selectedYear === year ? "selected" : ""
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {/* Part Type Selection */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.partType}</h3>
        <div className="part-type-selection">
          <div
            className={`radio-option ${
              partType === "commercial" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              id="commercial"
              name="partType"
              value="commercial"
              checked={partType === "commercial"}
              onChange={(e) => setPartType(e.target.value)}
            />
            <label htmlFor="commercial">{t.commercial}</label>
          </div>
          <div
            className={`radio-option ${
              partType === "original" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              id="original"
              name="partType"
              value="original"
              checked={partType === "original"}
              onChange={(e) => setPartType(e.target.value)}
            />
            <label htmlFor="original">{t.original}</label>
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <button className="filter-button" onClick={handleFilter}>
        <span>{t.filter}</span>
        <i className="filter-icon"></i>
      </button>
    </div>
  );
};

export default Sidebar;
