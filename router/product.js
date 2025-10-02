const express = require("express");
const router = express.Router();

const { seedProducts, getAllProducts, getProduct, getProductsByCategory } = require("../controller/product");

router.post("/seedProducts", seedProducts);

router.get("/products", getAllProducts);

router.get("/product/:id", getProduct);

router.get("/products/category/:categoryId", getProductsByCategory);

module.exports = router;
