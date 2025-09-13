import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import CartRow from "./CartRow";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const CartPage = ({ token }) => {
  const [cart, setCart] = useState([]);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [token]);

  const updateQuantity = async (id, qty) => {
    if (qty <= 0) return;
    try {
      const res = await axios.put(
        `${BackendUrl}/cart/${id}`,
        { Qty: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(cart.map((item) => (item._id === id ? res.data : item)));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${BackendUrl}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.productVariant ? item.productVariant.cost : item.product.cost;
    return sum + price * item.Qty;
  }, 0);

  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        alert("Your Cart is Empty!!");
        return;
      }

      const orders = cart.map((item) => {
        const price = item.productVariant ? item.productVariant.cost : item.product.cost;
        return {
          product: item.product,
          productVariant: item.productVariant || null,
          quantity: item.Qty,
          totalPrice: price * item.Qty,
        };
      });

      const res = await axios.post(
        `${BackendUrl}/orders`,
        { orders, instructions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order placed:", res.data);
      alert("Order placed successfully!");
      setCart([]);
      setInstructions("");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <>
    <style>
  {`
    @media (max-width: 500px) {
      /* Hide Price column + taxes note */
      .price-heading {
        display: none !important;
      }
      .taxes-text {
      font-size: 1rem !important;
        // display: none !important;
      }

      /* Reduce font sizes */
      h2 {
        font-size: 1.2rem !important;
      }
      h4 {
        font-size: 1rem !important;
      }
      h5 {
        font-size: 0.9rem !important;
      }
      strong {
        font-size: 0.9rem !important;
      }
      span, div, label {
        font-size: 0.8rem !important;
      }

      /* Shrink buttons */
      .btn {
        font-size: 0.75rem !important;
        padding: 0.25rem 0.5rem !important;
      }

      /* Shrink checkout button */
      .btn-lg {
        font-size: 0.85rem !important;
        padding: 0.4rem 0.8rem !important;
      }

      /* Shrink textarea */
      textarea {
        font-size: 0.8rem !important;
      }

      /* Cart row image */
      .cart-row img {
        width: 50px !important;
        height: 50px !important;
      }

      /* Cart row padding */
      .cart-row {
        padding: 0.5rem 0 !important;
      }
    }
  `}
</style>


    <div className="container my-5">
      <h2 className="text-center mb-4">Cart</h2>

      <div className="cart-header d-flex justify-content-between text-muted mb-3">
        <span style={{ flex: 2 }}>Product</span>
        <span style={{ flex: 1, textAlign: "center" }} className="price-heading">Price</span>
        <span style={{ flex: 1, textAlign: "center" }}>Quantity</span>
        <span style={{ flex: 1, textAlign: "right" }}>Total</span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Your cart is empty</h4>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <CartRow
              key={item._id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}

          <hr className="my-4" />

          <Form.Group className="mb-3">
            <Form.Label><strong>Special instructions</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add a note for your order..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5 className="mb-0">
              <strong>₹{total.toFixed(2)} </strong>
            </h5>
            <div className="text-muted small taxes-text" >Taxes and shipping not included</div>
            <Button variant="primary" size="lg" onClick={placeOrder}>
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default CartPage;
