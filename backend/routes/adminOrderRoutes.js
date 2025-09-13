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

router.get("/cancel", auth , async(req, res)=>{
  try{
    const orders = await Order.find({status : 'cancelled'})
      .populate("user", "username email")       // only show username + email
      .populate("product")        // only show product name + price
      .populate("variant")   // only show variant details
      .sort({ createdAt: -1 });// newest first

      console.log("canceled order : ");
      console.log(orders);

    res.status(200).json({orders});


  }catch(error){
    console.error("Error fetching orders:", error);
    res.status(500).json({message: "Server error"});
  }
})

router.put("/:id" , auth , async(req , res)=>{
  try{
    const {id} = req.params;
    const {status} = req.body;

    const normalizedStatus = status?.toLowerCase();

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status : normalizedStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({message : 'Sucessfully Updated the product'});


  }catch(error){
     console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
})



module.exports = router;
