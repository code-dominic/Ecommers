import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Product = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
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

    if (productId) {
      fetchData();
    }
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

  const handelDelete = async () =>{
    try{
      await axios.delete(`http://localhost:5000/products/${productId}`);
      console.log("product deleted!!");
      navigate("/");
    }catch(error){
      console.log("There is some Error in Deleting the product!!" , error);
    }
  }

  const handelUpdate = ()=>{ navigate("/updateForm")};

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
      {/* Product Card */}
      <div className="card" style={{ width: "36rem" }}>
        <img src={product.imageUrl} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <button className="btn btn-outline-success">Cost: ₹{product.cost}</button>
          <button className="btn btn-outline-warning ms-2">Cart</button>
          <button className="btn btn-outline-danger ms-2" onClick={handelDelete}>Delete</button>
          <button className="btn btn-outline-primary m-2"onClick={handelUpdate} >Update</button>
        </div>
      </div>

      {/* Review Section */}
      <div className="card" style={{ width: "36rem", padding: "1rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Enter Your Review</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          <label htmlFor="customRange1" className="form-label">Rating: {rating}</label>
          <input
            type="range"
            className="form-range"
            id="customRange1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          />
          <button type="submit" className="btn btn-primary mt-2">Submit</button>
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
  );
};

export default Product;
