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

const router = express.Router();

router
    .get('/info', recipeInfo)
    .get('/reviews', listReviews)
    // 카테고리별 목록은 GET /list?category= 로 통합 (구 per-category 엔드포인트 제거됨)
    .get('/list', listRecipes)
    .get('/myList', myList)
    .get('/wishList', wishList)
    .post('/write', upload, createOrUpdate)
    .post('/clickwish', toggleWish)
    .post('/review', upsertReview)
    .delete('/review', deleteReview)
    .delete('/:id', removeRecipe); // DELETE /recipe/:id - 레시피 삭제

export default router;
