const express = require("express");
const router = express.Router();

const {getWriting, postWriting, getWatch, writeComment, deleteBoard} = require("../controllers/board");

router
    .get("/write", getWriting)
    .get("/watch", getWatch)
    .get("/delete", deleteBoard)
    .post("/write", postWriting)
    .post("/commentWrite", writeComment);

module.exports = router;