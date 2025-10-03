const Cart = require("../model/cart");
const Product = require("../model/product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
    const qty = quantity && quantity > 0 ? quantity : 1;
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    res.status(200).json({
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        data: { items: [], total: 0 },
      });
    }
    let cartTotal = 0;

    cart.items.forEach((item) => {
      if (item.product && item.product.price) {
        cartTotal += item.product.price * item.quantity;
      }
    });
    res.status(200).json({
      message: "Cart retrieved successfully",
      data: {
        items: cart.items,
        total: cartTotal.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json({
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user;

    const cart = await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
