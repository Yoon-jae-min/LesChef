const express = require("express");
const router = express.Router();
const { adminWrite, commonWrite } = require("../controllers/recipeWriteController");
const { koreanList, japaneseList, chineseList, westernList, shareList } = require("../controllers/recipeGetController");

router
    .get("/koreanList", koreanList)
    .get("/japaneseList", japaneseList)
    .get("/chineseList", chineseList)
    .get("/westernList", westernList)
    .get("/shareList", shareList)
    .post("/adminWrite", adminWrite)
    .post("/commonWrite", commonWrite);

module.exports = router;
