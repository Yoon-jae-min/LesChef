const express = require("express");
const router = express.Router();
const { adminWrite, commonWrite } = require("../controllers/recipeWriteController");

router
    .post("/adminWrite", adminWrite)
    .post("/commonWrite", commonWrite);

module.exports = router;
