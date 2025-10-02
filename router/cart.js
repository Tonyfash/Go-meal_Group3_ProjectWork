// router/cart.js
const express = require("express");
const { addToCart, getCart, updateCart, clearCart } = require("../controller/cart");

const { checkLogin } = require("../middleware/auth");

const router = express.Router();

router.post("/cart/add", checkLogin, addToCart);
router.get("/cart", checkLogin, getCart);
router.put("/cart/update", checkLogin, updateCart);
router.delete("/cart/clear", checkLogin, clearCart);

module.exports = router;
