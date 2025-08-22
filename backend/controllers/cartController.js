const User = require("../models/User");
const Variant = require("../models/Variant");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  const { id } = req.params; // product ID
  const { Qty, variantId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If product has no variants
    if (!variantId) {
      // If product actually has variants, reject request
      if (product.variants && product.variants.length > 0) {
        return res
          .status(400)
          .json({ error: "Variant ID required for this product" });
      }

      // Find if already in cart
      const existingItem = user.cart.find(
        (item) => item.productVariant === undefined && item.product.toString() === id
      );

      if (existingItem) {
        existingItem.Qty += Qty;
      } else {
        user.cart.push({
          product : id,
          Qty,
          productVariant: null, // no variant
        });
      }
    } else {
      // Check if variant exists
      const variant = await Variant.findById(variantId);
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }

      // Check if already in cart
      const existingItem = user.cart.find(
        (item) => item.productVariant?.toString() === variantId
      );

      if (existingItem) {
        existingItem.Qty += Qty;
      } else {
        user.cart.push({
          product : id,
          Qty,
          productVariant: variantId,
        });
      }
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate([
      { path: "cart.product", model: "Product" },
      { path: "cart.productVariant", model: "Variant", populate: { path: "product" } }
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Get cart error:", error);
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
