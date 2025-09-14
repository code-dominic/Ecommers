const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

router.post("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log(id);
    // Find the order that belongs to the logged-in user
    const order = await Order.findOne({ _id: id, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If already returned, prevent duplicate request
    if (order.return && order.return.isReturned) {
      return res.status(400).json({ message: "Return already requested for this order" });
    }

    // Update the return info
    order.return = {
      isReturned: true,
      reason,
      status: "requested",
      requestedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      message: "Return request submitted successfully",
      order,
    });
  } catch (error) {
    console.error("Return request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth , async (req, res) => {
  try {
    // Find orders where return.isReturned = true or return object exists
    const returns = await Order.find({ "return.isReturned": true })
      .populate("user", "username email")        // populate user info
      .populate("product", "name")               // populate product name
      .populate("variant", "name size color")    // populate variant info
      .sort({ "return.requestedAt": -1 });      // latest returns first

    res.json({ success: true, returns });
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;