import express from 'express';
import {
    listCuratedIngredientPrices,
    searchIngredientPrice,
} from '../../controllers/ingredientPrice';

const router = express.Router();

router.get('/curated', listCuratedIngredientPrices);
router.get('/search', searchIngredientPrice);

export default router;
