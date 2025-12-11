const express = require("express");
const router = express.Router();
const { recipeWrite, clickWish, deleteRecipe } = require("../controllers/recipeWrite");
const {
    // koreanList,
    // japaneseList,
    // chineseList,
    // westernList,
    // shareList,
    listRecipes,
    myList,
    wishList,
    recipeInfo
} = require("../controllers/recipeGet");
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
    .post("/write", upload, recipeWrite)
    .post("/clickwish", clickWish)
    .delete("/:id", deleteRecipe); // DELETE /recipe/:id - 레시피 삭제


module.exports = router;
