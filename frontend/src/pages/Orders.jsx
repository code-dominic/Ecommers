import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching Orders", error);
      }
    };

    fetchOrders();
  }, [token]);

  // ✅ Remove item from order
  const cancelOrder = async (orderId) => {
  try {
    // alert("Canceling order!!");

    await axios.patch(
      `${BackendUrl}/orders/${orderId}/cancel`,
      {}, // or { status: "canceled" } depending on your API
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

  } catch (error) {
    console.error("Error canceling order", error);
  }
};


  return (
    <div className="container mt-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have not ordered anything yet!</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Color</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const price = order.variant
                ? order.variant.cost
                : order.product.cost;

              const name = order.product.name;

              return (
                <tr key={order._id}>
                  <td>{name}</td>
                  <td>{order.variant ? order.variant.color : "N/A"}</td>
                  <td>{order.variant ? order.variant.size : "N/A"}</td>
                  <td>{order.quantity}</td>
                  <td>₹{price}</td>
                  <td>₹{price * order.quantity}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => cancelOrder(order._id)}>
                      Cancel Order
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Orders;
