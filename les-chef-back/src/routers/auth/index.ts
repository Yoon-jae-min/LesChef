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
    postRefresh,
} from '../../controllers/auth';
import { requireAuth } from '../../middleware/auth/auth';

const router = express.Router();

router
    .post('/findId', findIdByProfile)
    .post('/verifyPasswordReset', verifyPasswordReset)
    .post('/resetPassword', completePasswordReset)
    .get('/logout', getLogout)
    .get('/auth', getAuth)
    .post('/refresh', postRefresh)
    .get('/info', requireAuth, getInfo)
    .patch('/info', requireAuth, infoChg)
    .get('/check', idCheck)
    .post('/pwdChg', requireAuth, pwdChg)
    .post('/check', requireAuth, pwCheck)
    .post('/login', postLogin)
    .post('/join', postJoin)
    .delete('/delete', requireAuth, delUser)
    .post('/unlink/:provider', unlinkSocialAccount)
    .get('/kakaoLogin', kakaoLogin)
    .get('/googleLogin', googleLogin)
    .get('/naverLogin', naverLogin)
    .post('/sendVerificationCode', sendVerificationCodeController)
    .post('/verifyEmailCode', verifyEmailCodeController);

export default router;
