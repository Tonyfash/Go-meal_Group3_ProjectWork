const express = require("express");
const router = express.Router();
const { seedCategories, getCategoriesByKitchen, getCategoriesById } = require("../controller/category");

router.post("/seedCategories", seedCategories);

router.get("/categories/:kitchenId", getCategoriesByKitchen);

router.get("/category/:id", getCategoriesById);

module.exports = router;
