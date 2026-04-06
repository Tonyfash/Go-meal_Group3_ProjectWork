
const express = require("express");
const router = express.Router();
const { checkLogin } = require("../middleware/auth");

const {
  seedProducts,
  getAllProducts,
  getSmartMealPlan,
  getRecommendedProducts,
  getProduct,
  getProductsByCategory,
} = require("../controller/product");


router.post("/seedProducts", seedProducts);

router.get("/products", getAllProducts);
router.get("/products/meal-plan", getSmartMealPlan);
router.get("/products/recommendations", checkLogin, getRecommendedProducts);

router.get("/product/:id", getProduct);

router.get("/products/category/:categoryId", getProductsByCategory);

module.exports = router;
