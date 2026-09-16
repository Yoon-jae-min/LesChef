import express from 'express';
import { searchFoodProducts } from '../../controllers/foodSearch';

const router = express.Router();

router.get('/', searchFoodProducts);
router.get('/search', searchFoodProducts);

export default router;
