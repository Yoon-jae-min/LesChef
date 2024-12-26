const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth, getInfo, idCheck} = require("../controllers/loginController");
const postJoin = require("../controllers/joinController");

router
    .get("/logout", getLogout)
    .get("/auth", getAuth)
    .get("/info", getInfo)
    .get("/idCheck", idCheck)
    .post("/login", postLogin)
    .post("/join", postJoin);

module.exports = router;