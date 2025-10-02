const express = require("express");
const router = express.Router();
const { seedKitchen, getAllKitchens, getKitchen } = require("../controller/kitchen");

router.post("/seed", seedKitchen);

router.get("/kitchen", getAllKitchens);

router.get("/:id", getKitchen);

module.exports = router;
