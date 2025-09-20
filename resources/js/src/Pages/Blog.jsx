import React from "react";
import Navbar from "../components/Navbar/Navbar";
import PageHeader from "../components/PageHeader/PageHeader";
import BlogComponent from "../components/Blog/Blog";

const BlogPage = () => {
  const breadcrumbs = [{ text: "الرئيسية", link: "/" }, { text: "المدونة" }];

  return (
    <>
      <Navbar />
      <PageHeader
        title="المدونة"
        breadcrumbs={breadcrumbs}
        image="assets/images/page-header.png"
        alt="Page Header"
      />
      <BlogComponent />
    </>
  );
};

export default BlogPage;
