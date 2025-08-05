const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  cost: Number,
  imageUrl: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
