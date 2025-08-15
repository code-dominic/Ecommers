import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";

const CartPage = ({ token }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [token]);

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cart.filter(item => item.productOrdered._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productOrdered._id}>
                <td>{item.productOrdered.name}</td>
                <td>{item.Qty}</td>
                <td>₹{item.productOrdered.cost}</td>
                <td>₹{item.productOrdered.cost * item.Qty}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => removeItem(item.productOrdered._id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CartPage;
