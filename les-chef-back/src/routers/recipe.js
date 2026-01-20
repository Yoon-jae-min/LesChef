const express = require("express");
const router = express.Router();
const {
    createOrUpdate,
    toggleWish,
    removeRecipe,
    listRecipes,
    myList,
    wishList,
    recipeInfo,
} = require("../controllers/recipe");
const { upload } = require("../uploads/recipeImgUpload");

router
    .get("/info", recipeInfo)
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
    .delete("/:id", removeRecipe); // DELETE /recipe/:id - 레시피 삭제


module.exports = router;
