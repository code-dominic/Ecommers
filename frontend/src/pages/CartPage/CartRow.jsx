import { Button } from "react-bootstrap";
import { X } from "lucide-react";

const CartRow = ({ item, updateQuantity, removeItem }) => {
  const price = item.productVariant ? item.productVariant.cost : item.product.cost;
  const total = price * item.Qty;
  const imageUrl = item.productVariant?.imageUrl || item.product.imageUrl;
  const name = item.productVariant
    ? `${item.product.name} (${item.productVariant.color}, ${item.productVariant.size})`
    : item.product.name;

  return (
    <>
      <style>
        {`
          @media (max-width: 500px) {
            .cart-price {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="d-flex align-items-center cart-row py-3 border-bottom">
        {/* Remove button + Image */}
        <div style={{ flex: 2 }} className="d-flex align-items-center">
          <Button
            variant="link"
            className="p-0 mr-3 text-danger"
            onClick={() => removeItem(item._id)}
          >
            <X size={20} />
          </Button>
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              borderRadius: "6px",
              marginRight: "15px",
            }}
            onError={(e) => (e.target.src = "/api/placeholder/70/70")}
          />
          <div>
            <div className="font-weight-bold">{name}</div>
          </div>
        </div>

        {/* Price */}
        <div className="cart-price" style={{ flex: 1, textAlign: "center" }}>
          ₹{price.toFixed(2)} USD
        </div>

        {/* Quantity controls */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => updateQuantity(item._id, item.Qty - 1)}
          >
            –
          </Button>
          <span className="mx-2">{item.Qty}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => updateQuantity(item._id, item.Qty + 1)}
          >
            +
          </Button>
        </div>

        {/* Total */}
        <div style={{ flex: 1, textAlign: "right" }}>₹{total.toFixed(2)}</div>
      </div>
    </>
  );
};

export default CartRow;
