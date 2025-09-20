import React from "react";
import { useLanguage } from "../context";
import { PageHeader, Blog as BlogComponent } from "../components";

const BlogPage = () => {
  const { language } = useLanguage();

  const breadcrumbs = [
    { text: language === 'ar' ? 'الرئيسية' : 'Home', link: "/" },
    { text: language === 'ar' ? 'المدونة' : 'Blog' }
  ];

  return (
    <>
      <PageHeader
        title={language === 'ar' ? 'المدونة' : 'Blog'}
        breadcrumbs={breadcrumbs}
        image="assets/images/page-header.png"
        alt="Page Header"
      />
      <BlogComponent />
    </>
  );
};

export default BlogPage;
