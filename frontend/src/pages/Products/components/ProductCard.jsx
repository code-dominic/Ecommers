import { Button } from "react-bootstrap";
import axios from "axios";
import VariantToggle from "./VariantToggle";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const ProductCard = ({
  product,
  currProduct,
  currColor,
  setCurrColor,
  currSize,
  setCurrSize,
  colorVariants,
  sizeVariants,
  token,
  productID,
  navigate,
  setShowUpdateModal,
}) => {
  const handleAddToCart = async () => {
    try {
      const payload = {
        Qty: 1,
        variantId: currProduct._id || null,
        selected: { color: currColor, size: currSize },
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

  const handleDelete = async () => {
    try {
      await axios.delete(`${BackendUrl}/products/${productID}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="card" style={{ width: "36rem" }}>
      <img src={currProduct.imageUrl || product.imageUrl} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>

        {colorVariants.length > 0 && (
          <VariantToggle label="Color" options={colorVariants} value={currColor} setValue={setCurrColor} />
        )}

        {sizeVariants.length > 0 && (
          <VariantToggle label="Size" options={sizeVariants} value={currSize} setValue={setCurrSize} />
        )}

        <div className="mt-3">
          <Button variant="outline-success" className="me-2">
            Cost: ₹{currProduct.cost ?? product.cost}
          </Button>
          <Button variant="outline-warning" className="me-2" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="outline-danger" className="me-2" onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => {
              setShowUpdateModal(true);
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
