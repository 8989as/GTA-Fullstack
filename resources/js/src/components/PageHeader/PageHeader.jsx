import React from "react";
import "./PageHeader.css";

const PageHeader = ({ title, breadcrumbs, image }) => {
  return (
    <section className="page-header">
      <div className="page-header-img">
        <img src={image} alt={title} />
        <div className="overlay"></div>
      </div>
      <div className="container">
        <div className="page-header-content bottom-right">
          <h1>{title}</h1>
          <nav className="breadcrumbs">
            <ol>
              {breadcrumbs.map((item, index) => (
                <li key={index}>
                  {item.link ? (
                    <a href={item.link}>{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
