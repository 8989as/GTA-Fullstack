import React, { useState, useEffect, useRef } from "react";
import { useProducts, useLanguage } from "../../../context";
import { translations } from "./translations";
import "./Sidebar.css";

const Sidebar = ({ language }) => {
  const { language: contextLanguage } = useLanguage();
  const currentLanguage = language || contextLanguage;
  const {
    filters,
    setFilters,
    clearFilters,
    searchProducts,
    resetSearch,
    hasActiveFilters,
  } = useProducts();

  // Local state for form inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [localFilters, setLocalFilters] = useState(filters);
  const searchTimeoutRef = useRef(null);

  const t = translations[currentLanguage] || translations.ar;

  // Sync local filters with global filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle search with debounce
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        searchProducts(query);
      } else {
        resetSearch();
      }
    }, 500);
  };

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    const newFilters = {
      ...localFilters,
      brand: localFilters.brand === brand ? "" : brand,
      model: "", // Reset model when brand changes
    };
    setLocalFilters(newFilters);
  };

  // Handle model selection
  const handleModelSelect = (model) => {
    const newFilters = {
      ...localFilters,
      model: model,
    };
    setLocalFilters(newFilters);
  };

  // Handle year selection
  const handleYearSelect = (year) => {
    const newFilters = {
      ...localFilters,
      year: localFilters.year === year ? "" : year,
    };
    setLocalFilters(newFilters);
  };

  // Handle part type selection
  const handlePartTypeSelect = (partType) => {
    const newFilters = {
      ...localFilters,
      part_type: partType,
    };
    setLocalFilters(newFilters);
  };

  // Handle price range changes
  const handlePriceChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({
      brand: "",
      model: "",
      year: "",
      part_type: "original",
      price_min: "",
      price_max: "",
    });
    setSearchQuery("");
    clearFilters();
    resetSearch();
  };

  // Check if local filters have changed
  const hasUnappliedChanges = () => {
    return JSON.stringify(localFilters) !== JSON.stringify(filters);
  };

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
    porsche: ["911", "Cayenne", "Macan", "Panamera"]
  };

  const years = [
    "2025", "2024", "2023", "2022", "2021", "2020",
    "2019", "2018", "2017", "2016", "2015", "2014"
  ];

  return (
    <div
      className="sidebar-filter p-4 bg-white rounded"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="filter-title mb-0">{t.filterProducts}</h2>
        {hasActiveFilters() && (
          <button 
            className="btn btn-link btn-sm text-danger p-0" 
            onClick={handleClearFilters}
            title={t.clearFilters || (currentLanguage === 'ar' ? 'مسح الفلاتر' : 'Clear Filters')}
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">
          {currentLanguage === 'ar' ? 'البحث' : 'Search'}
        </h3>
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder={currentLanguage === 'ar' ? 'ابحث عن قطع الغيار...' : 'Search for spare parts...'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <i className={`bi bi-search position-absolute top-50 translate-middle-y ${currentLanguage === 'ar' ? 'start-0 ms-3' : 'end-0 me-3'} text-muted`}></i>
        </div>
      </div>

      {/* Car Brand Selection */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.carBrand}</h3>
        <div className="car-brands-grid">
          {carBrands.map((brand) => (
            <div
              key={brand.id}
              className={`car-brand-item ${
                localFilters.brand === brand.id ? "selected" : ""
              }`}
              onClick={() => handleBrandSelect(brand.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleBrandSelect(brand.id);
                }
              }}
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
          value={localFilters.model}
          onChange={(e) => handleModelSelect(e.target.value)}
          disabled={!localFilters.brand}
        >
          <option value="">{t.selectModel}</option>
          {localFilters.brand &&
            carModels[localFilters.brand]?.map((model) => (
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
                localFilters.year === year ? "selected" : ""
              }`}
              onClick={() => handleYearSelect(year)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleYearSelect(year);
                }
              }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">
          {currentLanguage === 'ar' ? 'نطاق السعر' : 'Price Range'}
        </h3>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder={currentLanguage === 'ar' ? 'الحد الأدنى' : 'Min'}
              value={localFilters.price_min}
              onChange={(e) => handlePriceChange('price_min', e.target.value)}
              min="0"
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder={currentLanguage === 'ar' ? 'الحد الأقصى' : 'Max'}
              value={localFilters.price_max}
              onChange={(e) => handlePriceChange('price_max', e.target.value)}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Part Type Selection */}
      <div className="mb-4">
        <h3 className="filter-subtitle mb-3">{t.partType}</h3>
        <div className="part-type-selection">
          <div
            className={`radio-option ${
              localFilters.part_type === "commercial" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              id="commercial"
              name="partType"
              value="commercial"
              checked={localFilters.part_type === "commercial"}
              onChange={(e) => handlePartTypeSelect(e.target.value)}
            />
            <label htmlFor="commercial">{t.commercial}</label>
          </div>
          <div
            className={`radio-option ${
              localFilters.part_type === "original" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              id="original"
              name="partType"
              value="original"
              checked={localFilters.part_type === "original"}
              onChange={(e) => handlePartTypeSelect(e.target.value)}
            />
            <label htmlFor="original">{t.original}</label>
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="filter-actions">
        {hasUnappliedChanges() && (
          <button 
            className="btn btn-outline-primary w-100 mb-2" 
            onClick={handleApplyFilters}
          >
            <i className="bi bi-funnel me-2"></i>
            {currentLanguage === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
          </button>
        )}
        
        <button className="filter-button" onClick={handleApplyFilters}>
          <span>{t.filter}</span>
          <i className="filter-icon"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
