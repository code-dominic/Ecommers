const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
// const adminAuth = require("./middleware/adminAuth"); // optional if you have admin middleware

// GET all return requests
router.get("/", auth, async (req, res) => {
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


router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Allowed return statuses
  const validStatuses = ["requested", "approved", "rejected", "pickedUp", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid return status" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.return || !order.return.isReturned) {
      return res.status(400).json({ success: false, message: "This order does not have a return request" });
    }

    // Update return status
    order.return.status = status;

    // Optionally update timestamps
    if (status === "pickedUp" || status === "completed") {
      order.return.processedAt = new Date();
    }

    await order.save();

    res.json({ success: true, message: "Return status updated", return: order.return });
  } catch (error) {
    console.error("Error updating return status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
