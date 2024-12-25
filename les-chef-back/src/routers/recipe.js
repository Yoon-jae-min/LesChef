const express = require("express");
const router = express.Router();
const { adminWrite, commonWrite, recipeWrite } = require("../controllers/recipeWriteController");
const { koreanList, japaneseList, chineseList, westernList, shareList, recipeInfo } = require("../controllers/recipeGetController");

router
    .get("/info", recipeInfo)
    .get("/koreanList", koreanList)
    .get("/japaneseList", japaneseList)
    .get("/chineseList", chineseList)
    .get("/westernList", westernList)
    .get("/shareList", shareList)
    .post("/write", recipeWrite)
    .post("/adminWrite", adminWrite)
    .post("/commonWrite", commonWrite);

module.exports = router;
