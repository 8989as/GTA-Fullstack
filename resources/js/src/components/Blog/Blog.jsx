import React from 'react';
import BlogCard from './BlogCard/BlogCard';
import { useLanguage } from '../../context/LanguageContext';
import './Blog.css';

const Blog = () => {
  const { language } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      image: 'https://placehold.co/412x270',
      category: 'برمجة وتشخيص الأعطال',
      date: '15 أبريل 2025',
      title: 'وش يعني "برمجة السيارة"؟ وهل فعلاً تحتاجها؟',
      description: 'برمجة السيارة هي عملية تعديل أو تحديث السوفت وير داخل كمبيوتر السيارة (ECU). كمبيوتر السيارة يتحكم بكل شيء تقريباً: استهلاك الوقود، استجابة الدعسة، حرارة المكينة، وحتى أداء التيربو (لو موجود).'
    },
    // Add more blog posts as needed
  ];

  return (
    <div className="blog-section py-5">
      <div className="container">
        <div className="row g-4">
          {blogPosts.map(post => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4">
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;