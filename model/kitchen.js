const mongoose = require('mongoose');

const kitchenSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    kitchenName:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
}, {timestamps: true})

const kitchenModel = mongoose.model('Kitchen', kitchenSchema);

module.exports = kitchenModel