const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  kitchen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kitchen",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);