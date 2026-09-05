import express from 'express';
import { getIngredientPrices, searchIngredientPrice } from '../../controllers/ingredientPrice';

const router = express.Router();

router.get('/search', searchIngredientPrice);
router.get('/', getIngredientPrices);

export default router;
