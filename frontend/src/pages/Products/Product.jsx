import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Alert,
  Spinner,
  Modal,
  ProgressBar
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VariantToggle from "./components/VariantToggle";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const Product = ({ token, productID, setProductID }) => {
  const [product, setProduct] = useState(null);
  const [currProduct, setCurrProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [currColor, setCurrColor] = useState("");
  const [colorVariants, setColorVariants] = useState([]);

  const [currSize, setCurrSize] = useState("");
  const [sizeVariants, setSizeVariants] = useState([]);
  const [availableSizesForColor, setAvailableSizesForColor] = useState([]);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BackendUrl}/products/${productID}`);
        const data = res.data;
        setProduct(data);

        if (data.variant && data.variant.length > 0) {
          const uniqueColors = [...new Set(data.variant.map((v) => v.color))];
          const uniqueSizes = [...new Set(data.variant.map((v) => v.size))];

          setColorVariants(uniqueColors);
          setSizeVariants(uniqueSizes);

          const defaultVariant = data.variant[0];
          setCurrColor(defaultVariant.color);
          setCurrSize(defaultVariant.size);

          const sizesForColor = [
            ...new Set(
              data.variant.filter((v) => v.color === defaultVariant.color).map((v) => v.size)
            ),
          ];
          setAvailableSizesForColor(sizesForColor);
          setCurrProduct(defaultVariant);
        } else {
          setCurrColor(data.color || "");
          setCurrSize(data.size || "");
          setCurrProduct(data);
          setColorVariants(data.color ? [data.color] : []);
          setSizeVariants(data.size ? [data.size] : []);
          setAvailableSizesForColor(data.size ? [data.size] : []);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        showAlert("Failed to load product details", "danger");
      } finally {
        setLoading(false);
      }
    };

    if (!productID) {
      const stored = localStorage.getItem("lastProductId");
      if (stored) setProductID && setProductID(stored);
    }

    if (productID) fetchData();
  }, [productID, setProductID]);

  useEffect(() => {
    if (!product || !product.variant) return;

    const sizes = [
      ...new Set(product.variant.filter((v) => v.color === currColor).map((v) => v.size)),
    ];
    setAvailableSizesForColor(sizes);

    if (sizes.length === 0) {
      setCurrSize(product.size);
      setCurrProduct(product);
    } else {
      if (!sizes.includes(currSize)) {
        setCurrSize(sizes[0]);
        const matched = product.variant.find((v) => v.color === currColor && v.size === sizes[0]);
        if (matched) setCurrProduct(matched);
      } else {
        const matched = product.variant.find((v) => v.color === currColor && v.size === currSize);
        if (matched) setCurrProduct(matched);
      }
    }
  }, [currColor, product]);

  useEffect(() => {
    if (!product || !product.variant) return;
    const matched = product.variant.find((v) => v.color === currColor && v.size === currSize);

    if (matched) {
      setCurrProduct(matched);
    } else {
      const byColor = product.variant.find((v) => v.color === currColor);
      if (byColor) setCurrProduct(byColor);
      else setCurrProduct(product);
    }
  }, [currSize, currColor, product]);

  const showAlert = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      setAddingToCart(true);
      const payload = {
        Qty: 1,
        variantId: currProduct?._id || null
      };

      await axios.post(`${BackendUrl}/cart/${productID}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert("Product added to cart successfully! 🛒", "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showAlert("Failed to add product to cart", "danger");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      showAlert("Please write a review before submitting", "warning");
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post(`${BackendUrl}/products/${productID}/review`, {
        text: reviewText,
        rating,
      });

      setReviewText("");
      setRating(5);

      const updated = await axios.get(`${BackendUrl}/products/${productID}`);
      setProduct(updated.data);

      showAlert("Review submitted successfully! ⭐", "success");
    } catch (err) {
      console.error("Error submitting review:", err);
      showAlert("Failed to submit review", "danger");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading product details...</div>
        </div>
      </Container>
    );
  }

  if (!currProduct) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <h4>Product not found</h4>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="product-page">
      <Container className="py-4">
        {alertMessage && (
          <Alert variant={alertVariant} dismissible onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        <Row className="g-4 align-items-stretch">
          {/* Product Image and Info */}
          < Col lg={6}>
            <Card className="product-image-card shadow-sm h-100">
                <Card.Img style={{height : "100%"}}
                  src={currProduct.imageUrl || product.imageUrl}
                  alt={product.name}
                  className="product-image mb-3"
                />
            </Card>
          </Col>

          {/* Product Details */}
          <Col lg={6}>
            <Card className="product-details-card shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="product-header mb-4">
                  <Badge bg="primary" className="mb-2">New Arrival</Badge>
                  <h1 className="product-title">{product.name}</h1>

                  {/* Rating Display */}
                  <div className="rating-section mb-3">
                    <div className="rating-stars">
                      {renderStars(getAverageRating())}
                      <span className="rating-number ms-2">({getAverageRating()})</span>
                    </div>
                    <div className="review-count text-muted">
                      {product.reviews?.length || 0} Reviews
                    </div>
                  </div>

                  <div className="price-section mb-4">
                    <h2 className="current-price">₹{currProduct.cost ?? product.cost}</h2>
                  </div>
                </div>

                <div className="product-description mb-4">
                  <h5>Description</h5>
                  <p className="text-muted">{product.description}</p>
                </div>

                {/* Variant Selection */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
  {colorVariants.length > 0 && (
    <VariantToggle
      label="Color"
      options={colorVariants}
      value={currColor}
      setValue={setCurrColor}
    />
  )}

  {sizeVariants.length > 0 && (
    <VariantToggle
      label="Size"
      options={sizeVariants}
      value={currSize}
      setValue={setCurrSize}
    />
  )}
</div>
                {/* Action Buttons */}
                <div className="action-buttons">
                  <Button
                    variant="primary"
                    size="lg"
                    className="add-to-cart-btn me-3"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Adding...
                      </>
                    ) : (
                      "🛒 Add to Cart"
                    )}
                  </Button>

                  <Button variant="outline-secondary" size="lg">
                    ❤️ Wishlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col>
            <Card className="reviews-section shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">Customer Reviews</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Write Review */}
                  <Col md={5}>
                    <div className="write-review-section">
                      <h5 className="mb-3">Write a Review</h5>
                      <Form onSubmit={handleSubmitReview}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Review</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Share your thoughts about this product..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="review-textarea"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Rating: {rating} ⭐</Form.Label>
                          <Form.Range
                            min={1}
                            max={5}
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            className="rating-slider"
                          />
                          <div className="rating-labels d-flex justify-content-between small text-muted">
                            <span>Poor</span>
                            <span>Excellent</span>
                          </div>
                        </Form.Group>

                        <Button
                          type="submit"
                          variant="primary"
                          disabled={submittingReview || !reviewText.trim()}
                          className="submit-review-btn"
                        >
                          {submittingReview ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Review"
                          )}
                        </Button>
                      </Form>
                    </div>
                  </Col>

                  {/* Reviews List */}
                  <Col md={7}>
                    <div className="reviews-list">
                      <h5 className="mb-3">
                        All Reviews ({product.reviews?.length || 0})
                      </h5>

                      {(!product.reviews || product.reviews.length === 0) ? (
                        <div className="no-reviews text-center py-4">
                          <div className="mb-3">📝</div>
                          <h6>No reviews yet</h6>
                          <p className="text-muted">Be the first to share your thoughts about this product!</p>
                        </div>
                      ) : (
                        <div className="reviews-container">
                          {product.reviews.map((review) => (
                            <Card key={review._id} className="review-card mb-3">
                              <Card.Body>
                                <div className="review-header d-flex justify-content-between align-items-start mb-2">
                                  <div className="review-rating">
                                    {renderStars(review.rating)}
                                  </div>
                                  <small className="text-muted">
                                    {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                  </small>
                                </div>
                                <p className="review-text mb-0">{review.text}</p>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .product-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .product-image-card {
          border-radius: 15px;
          overflow: hidden;
          border: none;
        }

        .image-container {
          position: relative;
          height: 500px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .product-details-card {
          border-radius: 15px;
          border: none;
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #212529;
          margin-bottom: 0;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .rating-stars {
          font-size: 1.2rem;
        }

        .rating-number {
          font-weight: 600;
          color: #495057;
        }

        .review-count {
          font-size: 0.9rem;
        }

        .current-price {
          font-size: 2.2rem;
          font-weight: 700;
          color: #28a745;
          margin: 0;
        }

        .product-description p {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .variant-section {
          padding: 15px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .variant-section:last-child {
          border-bottom: none;
        }

        .action-buttons {
          padding-top: 20px;
          border-top: 2px solid #e9ecef;
        }

        .add-to-cart-btn {
          font-weight: 600;
          padding: 12px 30px;
          font-size: 1.1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,123,255,0.3);
        }

        .reviews-section {
          border-radius: 15px;
          border: none;
        }

        .write-review-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          height: fit-content;
        }

        .write-review-section h5 {
          color: white;
        }

        .review-textarea {
          border-radius: 10px;
          border: none;
          resize: none;
        }

        .rating-slider {
          margin: 10px 0;
        }

        .submit-review-btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .submit-review-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        .reviews-container {
          max-height: 400px;
          overflow-y: auto;
        }

        .review-card {
          border: none;
          background: #f8f9fa;
          border-radius: 10px;
          transition: transform 0.2s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .no-reviews {
          color: #6c757d;
        }

        .no-reviews div:first-child {
          font-size: 3rem;
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 2rem;
          }

          .current-price {
            font-size: 1.8rem;
          }

          .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .add-to-cart-btn,
          .add-to-cart-btn + button {
            width: 100%;
          }


        }

         @media (max-width: 576px){
         /* Reduce font sizes */
        .product-title {
            font-size: 1.5rem;
          }

          .current-price {
            font-size: 1.2rem;
          }

          .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

      h2 {
        font-size: 1.2rem !important;
      }
      h4 {
        font-size: 1rem !important;
      }
      h5 {
        font-size: 0.9rem !important;
      }
      strong {
        font-size: 0.9rem !important;
      }
      span, div, label {
        font-size: 0.6rem;
      }
      

      /* Shrink buttons */
      .btn {
        font-size: 0.75rem !important;
        padding: 0.25rem 0.5rem !important;
      }

      /* Shrink checkout button */
      .btn-lg {
        font-size: 0.85rem !important;
        padding: 0.4rem 0.8rem !important;
      }

      /* Shrink textarea */
      textarea {
        font-size: 0.8rem !important;
      }
        .navDiv { 
        font-size: 12.8px !important;
      }

         }
      `}</style>
    </div>
  );
};

export default Product;