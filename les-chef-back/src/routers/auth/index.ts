import express from "express";
import {
    postLogin,
    getLogout,
    getAuth,
    getInfo,
    infoChg,
    idCheck,
    pwdChg,
    pwCheck,
    postJoin,
    delUser,
    kakaoLogin,
    googleLogin,
    naverLogin,
    sendVerificationCodeController,
    verifyEmailCodeController,
} from "../../controllers/auth";

const router = express.Router();

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
    .get("/kakaoLogin", kakaoLogin)
    .get("/googleLogin", googleLogin)
    .get("/naverLogin", naverLogin)
    .post("/sendVerificationCode", sendVerificationCodeController)
    .post("/verifyEmailCode", verifyEmailCodeController);

export default router;

