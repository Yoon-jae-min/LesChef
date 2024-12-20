const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo} = require("../controllers/loginController");
const postJoin = require("../controllers/joinController");

router
    .post("/login", postLogin)
    .post("/join", postJoin)
    .get("/logout", getLogout)
    .get("/auth", getAuth)
    .get("/info", getInfo);

module.exports = router;