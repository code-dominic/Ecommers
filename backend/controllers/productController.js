const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");
const Variant = require("../models/Variant");


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
    console.log("📦 Received Product:", req.body);

    // 1️⃣ Create product first
    const { variants, ...productData } = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();

    // 2️⃣ Create variants if provided
    if (variants && variants.length > 0) {
      const createdVariants = await Promise.all(
        variants.map(async (variant) => {
          const newVariant = new Variant(variant);
          await newVariant.save();

          // push variant ref to product
          newProduct.variant.push(newVariant._id);
          return newVariant;
        })
      );

      await newProduct.save(); // save with variants
    }

    // 3️⃣ Populate product with variants before sending response
    const populatedProduct = await Product.findById(newProduct._id).populate("variant");

    res.status(201).json({
      message: "✅ Product (with variants) created successfully!",
      data: populatedProduct,
    });

  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(500).json({
      message: "❌ Error creating product",
      error: error.message,
    });
  }
};



exports.getProductById = async (req, res) => {
  try {
    console.log("hiting the routr!!");
    const product = await Product.findById(req.params.id)
    .populate("reviews")
    .populate("variant");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
    
  } catch (error) {
    console.error(error.message);
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
    await User.updateMany({}, { $pull: { cart: { product : req.params.id } } });
    await Variant.deleteMany({ _id : { $in : product.variant}});
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product and related reviews deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};