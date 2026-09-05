import express from 'express';
import { searchIngredientPrice } from '../../controllers/ingredientPrice';

const router = express.Router();

router.get('/search', searchIngredientPrice);

export default router;
