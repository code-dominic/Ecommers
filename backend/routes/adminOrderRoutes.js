const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");




router.get("/"  , async (req, res) => {
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
