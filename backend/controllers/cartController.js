const User = require("../models/User");

exports.addToCart = async (req, res) => {
  const { id } = req.params;
  const { Qty } = req.body;
  try {
    const user = await User.findById(req.userId);
    const existingItem = user.cart.find(item => item.productOrdered.toString() === id);

    if (existingItem) existingItem.Qty += Qty;
    else user.cart.push({ productOrdered: id, Qty });

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.productOrdered");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.productOrdered.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ message: "Item removed", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
