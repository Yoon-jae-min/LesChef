const express = require("express");
const router = express.Router();
const {postLogin, getLogout, getAuth} = require("../controllers/loginController");
const postJoin = require("../controllers/joinController");

router
    .post("/login", postLogin)
    .post("/join", postJoin)
    .get("/logout", getLogout)
    .get("/auth", getAuth);

module.exports = router;