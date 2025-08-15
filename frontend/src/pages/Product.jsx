import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const Product = ({ token , productId }) => {
  // const productId = useParams();
  const pid = productId || localStorage.getItem("lastProductId");
  const [product, setProduct] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedCost, setUpdatedCost] = useState("");
  const [updatedImageUrl, setUpdatedImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      }
    };
    if (productId) fetchData();
  }, [productId]);

  if (!product) {
    return <h4>Loading product...</h4>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/products/${productId}/review`, {
        text: reviewText,
        rating: rating
      });

      setReviewText("");
      setRating(5);

      const updatedProduct = await axios.get(`http://localhost:5000/products/${productId}`);
      setProduct(updatedProduct.data);
    } catch (e) {
      console.error("❌ Error submitting review:", e);
    }
  };

  const handelDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      console.log("Product deleted!!");
      navigate("/");
    } catch (error) {
      console.log("There is some Error in Deleting the product!!", error);
    }
  };

  const handelUpdate = () => {
    setUpdatedName(product.name);
    setUpdatedDescription(product.description);
    setUpdatedCost(product.cost);
    setUpdatedImageUrl(product.imageUrl);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/products/${productId}`, {
        name: updatedName,
        description: updatedDescription,
        cost: updatedCost,
        imageUrl : updatedImageUrl
      });
      const updatedProduct = await axios.get(`http://localhost:5000/products/${productId}`);
      setProduct(updatedProduct.data);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handelCart = async(e) =>{
    e.preventDefault();
    try{
      await axios.post(
      `http://localhost:5000/products/cart/${productId}`,
      { Qty: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Added to cart!");

    }catch(error){
     console.error("Error adding to cart:", error);
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
        {/* Product Card */}
        <div className="card" style={{ width: "36rem" }}>
          <img src={product.imageUrl} className="card-img-top" alt={product.name} />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            <Button variant="outline-success">Cost: ₹{product.cost}</Button>
            <Button variant="outline-warning" className="ms-2" onClick={handelCart}>Cart</Button>
            <Button variant="outline-danger" className="ms-2" onClick={handelDelete}>Delete</Button>
            <Button variant="outline-primary" className="m-2" onClick={handelUpdate}>Update</Button>
          </div>
        </div>

        {/* Review Section */}
        <div className="card" style={{ width: "36rem", padding: "1rem" }}>
          <form onSubmit={handleSubmit}>
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
          {Array.isArray(product.reviews) && product.reviews.map((r) => (
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

      {/* Update Modal using React Bootstrap */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                value={updatedCost}
                onChange={(e) => setUpdatedCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo Link</Form.Label>
              <Form.Control
                type="text"
                value={updatedImageUrl}
                onChange={(e) => setUpdatedImageUrl(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Product;