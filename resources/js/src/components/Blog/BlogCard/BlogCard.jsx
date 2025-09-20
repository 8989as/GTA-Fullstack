import React from 'react';
import './BlogCard.css';
import { useLanguage } from '../../../context/LanguageContext';

const BlogCard = ({ image, category, date, title, description }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`card blog-card ${isRTL ? 'rtl' : 'ltr'}`} style={{ maxWidth: '412px' }}>
      {/* Image Section */}
      <div 
        className="blog-card-img position-relative" 
        style={{ 
          height: '270px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="badge-container p-3 d-flex gap-2 justify-content-end">
          <div className="badge bg-light bg-opacity-25 text-white p-2 rounded">
            {date}
          </div>
          <div className="badge bg-light bg-opacity-25 text-white p-2 rounded">
            {category}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-body bg-white p-4">
        <h3 className="card-title text-primary mb-3">
          {title}
        </h3>
        <p className="card-text text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;