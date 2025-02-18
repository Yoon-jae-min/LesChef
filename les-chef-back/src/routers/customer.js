const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo, infoChg, idCheck, pwdChg, pwCheck} = require("../controllers/login");
const {postJoin, delUser} = require("../controllers/join");
const {kakaoLogin} = require("../controllers/snsLogin");

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
    .delete("/delete", delUser)
    .get("/kakaoLogin", kakaoLogin);

module.exports = router;