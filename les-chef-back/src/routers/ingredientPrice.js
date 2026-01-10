const express = require("express");
const router = express.Router();
const { getIngredientPrices } = require("../controllers/ingredientPrice");

router.get("/", getIngredientPrices);

module.exports = router;

