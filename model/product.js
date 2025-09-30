const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'kitchens'
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  productImages: [{
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true }
    }],
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;