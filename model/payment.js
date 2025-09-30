const { required, types } = require('joi');
const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  price: {
    type: Number,
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending'
  }
});

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel;