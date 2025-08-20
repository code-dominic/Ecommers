const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Product created!", data: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    await Product.findByIdAndUpdate(req.params.id, { $push: { reviews: review._id } });
    res.status(201).json({ message: "Review recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Review.deleteMany({ _id: { $in: product.reviews } });
    await User.updateMany({}, { $pull: { cart: { productOrdered: req.params.id } } });
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product and related reviews deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};