import express from "express";
import { getIngredientPrices } from "../../controllers/ingredientPrice";

const router = express.Router();

router.get("/", getIngredientPrices);

export default router;

