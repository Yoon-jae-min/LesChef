const express = require("express");
const router = express.Router();
const { recipeWrite, clickWish } = require("../controllers/recipeWriteController");
const { koreanList, japaneseList, chineseList, westernList, shareList, myList, recipeInfo } = require("../controllers/recipeGetController");
const { upload } = require("../uploads/recipeImgUpload");

router
    .get("/info", recipeInfo)
    .get("/koreanList", koreanList)
    .get("/japaneseList", japaneseList)
    .get("/chineseList", chineseList)
    .get("/westernList", westernList)
    .get("/shareList", shareList)
    .get("/myList", myList)
    .post("/write", upload, recipeWrite)
    .post("/clickwish", clickWish);


module.exports = router;
