import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import OrderTimeline from "./OrderTimeline";
import ReturnTimeline from "./ReturnTimeline";

const OrderRow = ({ order, cancelOrder, returnOrder }) => {
  const price = order.variant ? order.variant.cost : order.product.cost;
  const total = price * order.quantity;
  const imageUrl = order.variant?.imageUrl || order.product.imageUrl;
  const name = order.product.name;

  const [showModal, setShowModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const handleReturnSubmit = () => {
    if (!returnReason.trim()) {
      alert("Please provide a reason for return.");
      return;
    }
    returnOrder(order._id, returnReason);
    setReturnReason("");
    setShowModal(false);
  };

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
          </div>
        </div>

        {/* Price */}
        <div style={{ flex: 1, textAlign: "center" }}>₹{price}</div>

        {/* Quantity */}
        <div style={{ flex: 1, textAlign: "center" }}>{order.quantity}</div>

        {/* Total */}
        <div style={{ flex: 1, textAlign: "right" }}>₹{total}</div>
      </div>

      {/* Timeline + Actions */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        {/* Show Return Timeline if returned, otherwise Order Timeline */}
        {order.return?.isReturned ? (
          <ReturnTimeline returnInfo={order.return} />
        ) : (
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
            returnInfo={order.return}
          />
        )}

        {/* Cancel Button (only if not canceled or delivered) */}
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

        {/* Return Button (only if delivered) */}
        {order.status.toLowerCase() === "delivered" && !order.return?.isReturned && (
          <>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              Return
            </Button>

            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Return Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Reason for return</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter reason..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleReturnSubmit}>
                  Submit Return
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderRow;
