import express from 'express';
import {
    createOrUpdate,
    toggleWish,
    removeRecipe,
    listRecipes,
    myList,
    wishList,
    recipeInfo,
    listReviews,
    upsertReview,
    deleteReview,
} from '../../controllers/recipe';
import { upload } from '../../uploads/recipeImg';
import { optionalAuth, requireAuth } from '../../middleware/auth/auth';

const router = express.Router();

router
    .get('/info', optionalAuth, recipeInfo)
    .get('/reviews', listReviews)
    // 카테고리별 목록은 GET /list?category= 로 통합 (구 per-category 엔드포인트 제거됨)
    .get('/list', listRecipes)
    .get('/myList', requireAuth, myList)
    .get('/wishList', requireAuth, wishList)
    .post('/write', requireAuth, upload, createOrUpdate)
    .post('/clickwish', requireAuth, toggleWish)
    .post('/review', requireAuth, upsertReview)
    .delete('/review', requireAuth, deleteReview)
    .delete('/:id', requireAuth, removeRecipe); // DELETE /recipe/:id - 레시피 삭제

export default router;
