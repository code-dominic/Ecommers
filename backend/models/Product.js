const mongoose = require('mongoose');
const Varaint = require('./Variant');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  color : String,
  size : String, 
  cost: Number,
  imageUrl: String,
  variant : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant"
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
