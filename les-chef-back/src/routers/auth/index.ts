import express from 'express';
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
    unlinkSocialAccount,
    sendVerificationCodeController,
    verifyEmailCodeController,
    findIdByProfile,
    verifyPasswordReset,
    completePasswordReset,
} from '../../controllers/auth';

const router = express.Router();

router
    .post('/findId', findIdByProfile)
    .post('/verifyPasswordReset', verifyPasswordReset)
    .post('/resetPassword', completePasswordReset)
    .get('/logout', getLogout)
    .get('/auth', getAuth)
    .get('/info', getInfo)
    .patch('/info', infoChg)
    .get('/check', idCheck)
    .post('/pwdChg', pwdChg)
    .post('/check', pwCheck)
    .post('/login', postLogin)
    .post('/join', postJoin)
    .delete('/delete', delUser)
    .post('/unlink/:provider', unlinkSocialAccount)
    .get('/kakaoLogin', kakaoLogin)
    .get('/googleLogin', googleLogin)
    .get('/naverLogin', naverLogin)
    .post('/sendVerificationCode', sendVerificationCodeController)
    .post('/verifyEmailCode', verifyEmailCodeController);

export default router;
