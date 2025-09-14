import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import OrderRow from "./OrderRow";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const OrderPage = ({ token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [token]);

  const cancelOrder = async (id) => {
    try {
      await axios.put(
        `${BackendUrl}/orders/${id}`,
        { status: "canceled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((o) =>
          o._id === id ? { ...o, status: "canceled" } : o
        )
      );
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const returnOrder = async (orderId, reason) => {
    try {
      await axios.post(
        `${BackendUrl}/returns/${orderId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Return request submitted successfully ✅");
    } catch (err) {
      console.error("Error submitting return:", err);
      alert("Failed to submit return ❌");
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 500px) {
            /* Hide Price column */
            .order-price-heading {
              display: none !important;
            }

            /* Font scaling */
            h2 {
              font-size: 1.2rem !important;
            }
            h4 {
              font-size: 1rem !important;
            }
            span, div, strong {
              font-size: 0.8rem !important;
            }

            /* Buttons */
            .btn {
              font-size: 0.75rem !important;
              padding: 0.25rem 0.5rem !important;
            }

            /* Images in OrderRow (if any) */
            .order-row img {
              width: 50px !important;
              height: 50px !important;
            }

            /* Row padding */
            .order-row {
              padding: 0.5rem 0 !important;
            }
          }
        `}
      </style>

      <div className="container my-5">
        <h2 className="text-center mb-4">My Orders</h2>

        <div className="order-header d-flex justify-content-between text-muted mb-3">
          <span style={{ flex: 3 }}>Product</span>
          <span
            style={{ flex: 1, textAlign: "center" }}
            className="order-price-heading"
          >
            Price
          </span>
          <span style={{ flex: 1, textAlign: "center" }}>Quantity</span>
          <span style={{ flex: 1, textAlign: "right" }}>Total</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No orders found</h4>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                cancelOrder={cancelOrder}
                returnOrder = {returnOrder}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default OrderPage;
