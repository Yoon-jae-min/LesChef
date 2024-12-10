const express = require("express");
const router = express.Router();
const postLogin = require("../controllers/loginController");
const postJoin = require("../controllers/joinController");

router
    .post("/login", postLogin)
    .post("/join", postJoin);

module.exports = router;