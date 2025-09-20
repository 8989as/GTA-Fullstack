import React, { useEffect, useState } from "react";
import "./Reviews.css";
import { fetchGooglePlaceReviews } from "../../../utils/googlePlacesApi";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchGooglePlaceReviews();
        setReviews(fetchedReviews);
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return <div className="reviews-container">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-container">Error: {error}</div>;
  }

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">أراء عملائنا</h2>

      <div
        id="customerReviews"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="reviews-slide">
                <div className="review-card">
                  <div className="review-background">
                    <img
                      src={review.bgImage}
                      alt=""
                      className="review-bg-image"
                    />
                    <div className="review-content">
                      <div className="review-header">
                        <div className="service-icon">
                          <div className="icon-bg"></div>
                        </div>
                        <h3 className="service-title">{review.service}</h3>
                      </div>
                      <p className="review-text">{review.text}</p>
                      <div className="review-author">
                        <div className="author-info">
                          <h4 className="author-name">{review.author}</h4>
                          <div className="rating">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <img
                          src={review.image}
                          alt={review.author}
                          className="author-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators custom-indicators">
          {reviews.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#customerReviews"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
