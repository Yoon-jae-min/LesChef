const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo, idCheck, pwdChg, pwCheck} = require("../controllers/login");
const {postJoin, delInfo} = require("../controllers/join");

router
    .get("/logout", getLogout)
    .get("/auth", getAuth)
    .get("/info", getInfo)
    .get("/check", idCheck)
    .post("/pwdChg", pwdChg)
    .post("/check", pwCheck)
    .post("/login", postLogin)
    .post("/join", postJoin)
    .delete("/delete", delInfo);

module.exports = router;