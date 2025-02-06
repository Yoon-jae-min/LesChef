const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo, infoChg, idCheck, pwdChg, pwCheck} = require("../controllers/login");
const {postJoin, delInfo} = require("../controllers/join");

router
    .get("/logout", getLogout)
    .get("/auth", getAuth)
    .get("/info", getInfo)
    .patch("/info", infoChg)
    .get("/check", idCheck)
    .post("/pwdChg", pwdChg)
    .post("/check", pwCheck)
    .post("/login", postLogin)
    .post("/join", postJoin)
    .delete("/delete", delInfo);

module.exports = router;