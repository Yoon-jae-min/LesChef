const express = require("express");
const router = express.Router();

const {getWriting, postWriting, getWatch, writeComment} = require("../controllers/board");

router
    .get("/write", getWriting)
    .post("/write", postWriting)
    .get("/watch", getWatch)
    .post("/commentWrite", writeComment);

module.exports = router;