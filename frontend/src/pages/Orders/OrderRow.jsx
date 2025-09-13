import { Button } from "react-bootstrap";
import OrderTimeline from "./OrderTimeline";

const OrderRow = ({ order, cancelOrder }) => {
  const price = order.variant ? order.variant.cost : order.product.cost;
  const total = price * order.quantity;
  const imageUrl = order.variant?.imageUrl || order.product.imageUrl;
  const name = order.product.name;

  return (
    <div className="d-flex flex-column border-bottom py-3 order-row">
      {/* Top Row - Product Info */}
      <div className="d-flex align-items-center">
        {/* Image */}
        <div style={{ flex: 3 }} className="d-flex align-items-center">
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "6px",
              marginRight: "15px",
            }}
            onError={(e) => (e.target.src = "/api/placeholder/70/70")}
          />
          <div>
            <div className="font-weight-bold">{name}</div>
            {/* <div className="text-muted small">
              {order.variant ? (
                <>
                  Color: {order.variant.color}, Size: {order.variant.size}
                </>
              ) : (
                "No variant"
              )}
            </div> */}
          </div>
        </div>

        {/* Price */}
        <div style={{ flex: 1, textAlign: "center" }}>₹{price}</div>

        {/* Quantity */}
        <div style={{ flex: 1, textAlign: "center" }}>{order.quantity}</div>

        {/* Total */}
        <div style={{ flex: 1, textAlign: "right" }}>
          ₹{total}
        </div>
      </div>

      {/* Timeline + Cancel Button */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <OrderTimeline status={order.status} createdAt={order.createdAt} />
        {order.status.toLowerCase() !== "canceled" &&
          order.status.toLowerCase() !== "delivered" && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => cancelOrder(order._id)}
            >
              Cancel Order
            </Button>
          )}
      </div>
    </div>
  );
};

export default OrderRow;
