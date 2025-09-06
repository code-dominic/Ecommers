import { useEffect, useState } from "react";
import axios from "axios";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VariantToggle from "./components/VariantToggle";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const Product = ({ token, productID, setProductID }) => {
  const [product, setProduct] = useState(null);        // full fetched product
  const [currProduct, setCurrProduct] = useState(null); // currently selected variant or product fallback

  const [currColor, setCurrColor] = useState("");
  const [colorVariants, setColorVariants] = useState([]);

  const [currSize, setCurrSize] = useState("");
  const [sizeVariants, setSizeVariants] = useState([]); // overall sizes (used for rendering)
  const [availableSizesForColor, setAvailableSizesForColor] = useState([]); // sizes available for selected color

  // other UI state (reviews/update)
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedCost, setUpdatedCost] = useState("");
  const [updatedImageUrl, setUpdatedImageUrl] = useState("");

  const navigate = useNavigate();

  // Fetch product on mount / when productID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/products/${productID}`);
        const data = res.data;
        setProduct(data);

        // If product has variants array (referenced as 'variant' in your schema)
        if (data.variant && data.variant.length > 0) {
          // Unique colors and sizes across all variants
          const uniqueColors = [...new Set(data.variant.map((v) => v.color))];
          const uniqueSizes = [...new Set(data.variant.map((v) => v.size))];

          setColorVariants(uniqueColors);
          setSizeVariants(uniqueSizes);

          // Default selections: pick first variant's color & size
          const defaultVariant = data.variant[0];
          setCurrColor(defaultVariant.color);
          setCurrSize(defaultVariant.size);

          // set available sizes for that color and current displayed product
          const sizesForColor = [
            ...new Set(
              data.variant.filter((v) => v.color === defaultVariant.color).map((v) => v.size)
            ),
          ];
          setAvailableSizesForColor(sizesForColor);

          setCurrProduct(defaultVariant);
        } else {
          // no variants -> fallback to product itself
          setCurrColor(data.color || "");
          setCurrSize(data.size || "");
          setCurrProduct(data);
          setColorVariants(data.color ? [data.color] : []);
          setSizeVariants(data.size ? [data.size] : []);
          setAvailableSizesForColor(data.size ? [data.size] : []);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };

    if (!productID) {
      const stored = localStorage.getItem("lastProductId");
      if (stored) setProductID && setProductID(stored);
    }

    if (productID) fetchData();
  }, [productID, setProductID]);

  // When currColor changes: update available sizes and pick a valid currSize if needed
  useEffect(() => {
    if (!product || !product.variant) return;

    // Compute sizes available for the selected color
    const sizes = [
      ...new Set(product.variant.filter((v) => v.color === currColor).map((v) => v.size)),
    ];
    setAvailableSizesForColor(sizes);

    if (sizes.length === 0) {
      // if no sizes for color (shouldn't normally happen), fallback to first variant
      const fallback = product;
      setCurrSize(product.size);
      setCurrProduct(fallback);
    } else {
      // If current size isn't in the available sizes, pick the first available size
      if (!sizes.includes(currSize)) {
        setCurrSize(sizes[0]);
        const matched = product.variant.find((v) => v.color === currColor && v.size === sizes[0]);
        if (matched) setCurrProduct(matched);
      } else {
        // if currSize still valid, update currProduct for color+size
        const matched = product.variant.find((v) => v.color === currColor && v.size === currSize);
        if (matched) setCurrProduct(matched);
      }
    }
  }, [currColor, product]);

  // When currSize changes: update currProduct for (color,size) pair
  useEffect(() => {
    if (!product || !product.variant) return;
    const matched = product.variant.find((v) => v.color === currColor && v.size === currSize);

    if (matched) {
      setCurrProduct(matched);
    } else {
      // if no exact match, try to pick a variant matching currColor only
      const byColor = product.variant.find((v) => v.color === currColor);
      if (byColor) setCurrProduct(byColor);
      else setCurrProduct(product); // fallback to product
    }
  }, [currSize, currColor, product]);

  // Loading guard
  if (!currProduct) return <h4>Loading product...</h4>;

  // --- Actions ---
  const handleAddToCart = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      Qty: 1,
      variantId: currProduct?._id || null
    };

    await axios.post(`${BackendUrl}/cart/${productID}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Added to cart!");
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("Failed to add to cart.");
  }
};

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BackendUrl}/products/${productID}/review`, {
        text: reviewText,
        rating,
      });

      setReviewText("");
      setRating(5);

      // refresh product & variants
      const updated = await axios.get(`${BackendUrl}/products/${productID}`);
      setProduct(updated.data);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BackendUrl}/products/${productID}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Simple update modal submit (keeps existing fields)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BackendUrl}/products/${productID}`, {
        name: updatedName,
        description: updatedDescription,
        cost: updatedCost,
        imageUrl: updatedImageUrl,
      });

      const updated = await axios.get(`${BackendUrl}/products/${productID}`);
      setProduct(updated.data);
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // --- Render ---
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
        {/* Product Card */}
        <div className="card" style={{ width: "36rem" }}>
          <img 
            style={{
              height : '500px',

            }}
            src={currProduct.imageUrl || product.imageUrl}
            className="card-img-top"
            alt={product.name}
          />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>

            {/* Color toggles (if multiple colors) */}
            {colorVariants.length > 0 && (
              <div className="mb-3">
                <VariantToggle label={'color'} options={colorVariants}  value ={currColor} setValue={setCurrColor}  />
              </div>
            )}

            {/* Size toggles: only sizes available for currently selected color are enabled */}
            {sizeVariants.length > 0 && (
              <div className="mb-3">
                

                <VariantToggle label={'Size'} options={sizeVariants}  value ={currSize} setValue={setCurrSize}  />  
              </div>
            )}

            <div className="mb-3">
              <Button variant="outline-success" className="me-2">
                Cost: ₹{currProduct.cost ?? product.cost}
              </Button>
              <Button variant="outline-warning" className="me-2" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              {/* <Button variant="outline-danger" className="me-2" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="outline-primary" onClick={() => {
                // open modal and prefill
                setUpdatedName(product.name);
                setUpdatedDescription(product.description);
                setUpdatedCost(product.cost);
                setUpdatedImageUrl(product.imageUrl);
                setShowUpdateModal(true);
              }}>
                Update
              </Button> */}
            </div>
          </div>
        </div>

        {/* Review Section */}
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
            <Button type="submit" className="mt-2">Submit</Button>
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
      </div>

      {/* Update Modal
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control type="number" value={updatedCost} onChange={(e) => setUpdatedCost(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo Link</Form.Label>
              <Form.Control type="text" value={updatedImageUrl} onChange={(e) => setUpdatedImageUrl(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal> */}
    </>
  );
};

export default Product;
