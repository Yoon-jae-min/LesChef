const express = require("express");
const router = express.Router();

const {getWriting, postWriting} = require("../controllers/board");

router
    .get("/write", getWriting)
    .post("/write", postWriting);

module.exports = router;