const express = require("express");
const router = express.Router();
const {getContents} = require("../controllers/foods");

router
    .get("/contents", getContents);

module.exports = router;