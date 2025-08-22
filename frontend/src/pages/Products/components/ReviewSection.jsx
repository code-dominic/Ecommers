import { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const ReviewSection = ({ product, productID, setProduct }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BackendUrl}/products/${productID}/review`, {
        text: reviewText,
        rating,
      });

      setReviewText("");
      setRating(5);

      const updated = await axios.get(`${BackendUrl}/products/${productID}`);
      setProduct(updated.data);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="card" style={{ width: "36rem", padding: "1rem" }}>
      <form onSubmit={handleSubmitReview}>
        <div className="mb-3">
          <label className="form-label">Enter Your Review</label>
          <textarea
            className="form-control"
            rows="3"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <label className="form-label">Rating: {rating}</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>

      <hr />
      <h5>Reviews</h5>
      {Array.isArray(product.reviews) && product.reviews.length === 0 && <p>No reviews yet.</p>}
      {Array.isArray(product.reviews) &&
        product.reviews.map((r) => (
          <div className="card mb-3" style={{ width: "100%" }} key={r._id}>
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {`Rating: ${"⭐".repeat(r.rating)}${"☆".repeat(5 - r.rating)}`}
              </h6>
              <p className="card-text">{r.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ReviewSection;
