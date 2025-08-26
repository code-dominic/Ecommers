const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    console.log("Placing order for user:", req.userId);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "No user found!" });
    }

    const { orders } = req.body;
    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: "No orders provided." });
    }

    // Save all orders in parallel
    const savedOrders = await Promise.all(
      orders.map(async (order) => {
        console.log(order);
        const newOrder = new Order({
          product: order.product,
          variant: order.productVariant,
          user: user._id,     // ✅ use ID not full user object
          status: "pending",
          quantity: order.quantity,
          totalPrice: order.totalPrice,
        });
        const savedOrder = await newOrder.save();
        user.orders.push(savedOrder._id); // ✅ store order reference
        return savedOrder;
      })
    );

    await user.save(); // ✅ persist changes to user

    return res.status(201).json({
      message: "Orders placed successfully!",
      orders: savedOrders,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    // const user = await User.findById(req.userId);

    // // check if user is admin
    // if (user.Role !== 'admin') {
    //   return res.status(403).json({ message: "Access denied: Admins only" });
    // }

    const orders = await Order.find()
      .populate("user", "username email")       // only show username + email
      .populate("product")        // only show product name + price
      .populate("variant")   // only show variant details
      .sort({ createdAt: -1 });                 // newest first

    res.status(200).json({ orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
