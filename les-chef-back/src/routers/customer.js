const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo, idCheck} = require("../controllers/login");
const postJoin = require("../controllers/join");

router
    .get("/logout", getLogout)
    .get("/auth", getAuth)
    .get("/info", getInfo)
    .get("/idCheck", idCheck)
    .post("/login", postLogin)
    .post("/join", postJoin);

module.exports = router;