const express = require('express');
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

router.get('/', auth, async (req, res) => {
    try {
        console.log("hitting route");

        const user = await User.findById(req.userId).populate([
            {
                path: "orders",
                model: "Order",
                populate: [
                    {
                        path: "product",
                        model: "Product"
                    },
                    {
                        path: "variant",
                        model: "Variant"
                    }
                ]
            }
        ]);

        if (!user) {
            return res.status(404).json({ message: "No user found!" });
        }

        console.log(user);
        res.status(200).json(user.orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There was some error", error: error.message });
    }
});

module.exports = router;