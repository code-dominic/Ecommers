import { useEffect, useState } from "react";
import axios from "axios";


const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/orders`); // adjust route if needed
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Orders Page</h1>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Order ID</th>
            <th className="border border-gray-400 p-2">User</th>
            <th className="border border-gray-400 p-2">Product</th>
            <th className="border border-gray-400 p-2">Size</th>
            <th className="border border-gray-400 p-2">Color</th>
            <th className="border border-gray-400 p-2">Quantity</th>
            <th className="border border-gray-400 p-2">Total Price</th>
            <th className="border border-gray-400 p-2">Status</th>
            <th className="border border-gray-400 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border border-gray-400 p-2">{order._id}</td>
              <td className="border border-gray-400 p-2">
                {order.user?.username || order.user?.email}
              </td>
              <td className="border border-gray-400 p-2">
                {order.product?.name} ({order.variant?.name || "N/A"})
              </td>
              <td className="border border-gray-400 p-2">
                {order.variant? order.variant.size : order.product.size }
              </td>
              <td className="border border-gray-400 p-2">
                {order.variant? order.variant.color : order.product.color }
              </td>

              <td className="border border-gray-400 p-2">{order.quantity}</td>
              <td className="border border-gray-400 p-2">₹{order.totalPrice}</td>
              <td className="border border-gray-400 p-2">{order.status}</td>
              <td className="border border-gray-400 p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
