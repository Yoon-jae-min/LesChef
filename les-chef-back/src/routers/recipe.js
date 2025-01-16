const express = require("express");
const router = express.Router();
const { recipeWrite, clickWish, deleteRecipe } = require("../controllers/recipeWrite");
const { koreanList, japaneseList, chineseList, westernList, shareList, myList, wishList, recipeInfo } = require("../controllers/recipeGet");
const { upload } = require("../uploads/recipeImgUpload");

router
    .get("/info", recipeInfo)
    .get("/koreanList", koreanList)
    .get("/japaneseList", japaneseList)
    .get("/chineseList", chineseList)
    .get("/westernList", westernList)
    .get("/shareList", shareList)
    .get("/myList", myList)
    .get("/wishList", wishList)
    .post("/write", upload, recipeWrite)
    .post("/clickwish", clickWish)
    .post("/delete", deleteRecipe);


module.exports = router;
