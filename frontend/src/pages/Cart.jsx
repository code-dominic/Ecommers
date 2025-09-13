import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const CartPage = ({ token }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [token]);

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${BackendUrl}/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cart.filter(item => item._id !== cartItemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };


  const placeOrder = async () => {
    try {

      if (cart.length === 0) {
        alert('Your Cart is Empty!!');
        return;
      }

      const orders = cart.map(item => {
        const price = item.productVariant ? item.productVariant.cost : item.product.cost;
        return {
          product : item.product,
          productVariant : (item.productVariant? item.productVariant : null),
          quantity : item.Qty,
          totalPrice: price * item.Qty
        };
      });

      const res = await axios.post(`${BackendUrl}/orders`, 
      { orders },  // payload
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Order placed:", res.data);
    alert("Order placed successfully!");


    } catch (error) {
      console.error("Error in Placing order : ", error);
    }
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart MF</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              // If variant exists, prefer its cost; else fallback to product cost
              const price = item.productVariant ? item.productVariant.cost : item.product.cost;
              const name = item.productVariant
                ? `${item.product.name} (${item.productVariant.color}, ${item.productVariant.size})`
                : item.product.name;

              return (
                <tr key={item._id}>
                  <td>{name}</td>
                  <td>
                    {item.productVariant
                      ? `${item.productVariant.color}`
                      : "N/A"}
                  </td>
                  <td>
                    {item.productVariant
                      ? `${item.productVariant.size}`
                      : "N/A"}
                  </td>
                  <td>{item.Qty}</td>
                  <td>₹{price}</td>
                  <td>₹{price * item.Qty}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

      )}

      <Button
        variant="outline-success"
        onClick={() => placeOrder()}
      >Order</Button>
    </div>
  );
};

export default CartPage;
