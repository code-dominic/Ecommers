const mongoose = require('mongoose');
const Varaint = require('./Varaint');

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
      ref: "Varaint"
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
