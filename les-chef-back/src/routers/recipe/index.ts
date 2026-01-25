import express from "express";
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
} from "../../controllers/recipe";
import { upload } from "../../uploads/recipeImg";

const router = express.Router();

router
    .get("/info", recipeInfo)
    .get("/reviews", listReviews)
    // 구 카테고리별 리스트 라우트 (미사용)
    // .get("/koreanList", koreanList)
    // .get("/japaneseList", japaneseList)
    // .get("/chineseList", chineseList)
    // .get("/westernList", westernList)
    // .get("/shareList", shareList)
    .get("/list", listRecipes)
    .get("/myList", myList)
    .get("/wishList", wishList)
    .post("/write", upload, createOrUpdate)
    .post("/clickwish", toggleWish)
    .post("/review", upsertReview)
    .delete("/review", deleteReview)
    .delete("/:id", removeRecipe); // DELETE /recipe/:id - 레시피 삭제

export default router;

