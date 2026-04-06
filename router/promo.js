const express = require("express");
const {
  seedPromos,
  createPromo,
  getActivePromos,
  applyPromoToCart,
  getLoyaltySummary,
} = require("../controller/promo");
const { checkLogin } = require("../middleware/auth");

const router = express.Router();

router.post("/promos/seed", seedPromos);
router.post("/promos", createPromo);
router.get("/promos", getActivePromos);
router.post("/promos/apply", checkLogin, applyPromoToCart);
router.get("/loyalty", checkLogin, getLoyaltySummary);

module.exports = router;
