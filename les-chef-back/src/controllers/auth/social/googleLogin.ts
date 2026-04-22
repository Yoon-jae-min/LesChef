/**
 * 구글 소셜 로그인 컨트롤러
 * 이메일 기반 계정 통합 지원
 */

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import { getGoogleToken, getGoogleUserInfo } from '../../../utils/external/google';
import logger from '../../../utils/system/logger';
import RefreshToken from '../../../models/auth/refreshTokenModel';
import {
    getRefreshTtlSeconds,
    makeRefreshJti,
    signAccessToken,
    signRefreshToken,
} from '../../../utils/auth/token';

const isDev = process.env.NODE_ENV !== 'production';

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { code, state } = req.query;

    try {
        if (code && typeof code === 'string') {
            // 구글 토큰 가져오기
            const tokenData = await getGoogleToken(code);

            if (!tokenData.access_token) {
                res.status(400).send('구글 로그인 실패: access_token 없음');
                return;
            }

            // 구글 사용자 정보 가져오기
            const googleUserInfo = await getGoogleUserInfo(tokenData.access_token);

            if (!googleUserInfo.email) {
                res.status(400).send('구글 로그인 실패: 이메일 정보 없음');
                return;
            }

            const googleEmail = googleUserInfo.email;
            const googleName = googleUserInfo.name || googleUserInfo.given_name || '구글사용자';
            const googleNickname = googleUserInfo.given_name || googleUserInfo.name || '구글사용자';
            const googleUniqueId = googleUserInfo.id;

            // [1] 계정 연동 모드: 로그인된 사용자의 계정에 구글 계정 연결
            if (req.session?.user?.id && state === 'link') {
                const baseUser = await User.findOne({ id: req.session.user.id });
                if (!baseUser) {
                    res.status(404).send('기존 사용자를 찾을 수 없습니다.');
                    return;
                }

                // 다른 계정에 이미 연결된 구글 ID 인지 확인
                if (googleUniqueId) {
                    const duplicated = await User.findOne({
                        googleId: googleUniqueId,
                        id: { $ne: baseUser.id },
                    }).lean();

                    if (duplicated) {
                        res.status(400).send('이미 다른 계정에 연동된 구글 계정입니다.');
                        return;
                    }

                    baseUser.googleId = googleUniqueId;
                    await baseUser.save();
                }

                const redirectBase = process.env.FRONTEND_URL || process.env.SERVER_ADDRESS;
                res.redirect(`${redirectBase}/myPage/info?link=google&status=success`);
                return;
            }

            // [2] 일반 구글 로그인 – 구글 ID/이메일 기반 계정 통합 로직
            let user = null;
            let finalUserId: string;

            // 0. googleId 로 먼저 조회
            if (googleUniqueId) {
                user = await User.findOne({ googleId: googleUniqueId }).lean();
            }

            if (user) {
                finalUserId = user.id;
            } else {
                // 1. 해당 이메일로 가입된 계정이 있으면 연결
                const existingUserByEmail = await User.findOne({ id: googleEmail }).lean();
                if (existingUserByEmail) {
                    // 기존 계정과 연결 (이메일 기반 통합)
                    user = existingUserByEmail;
                    finalUserId = existingUserByEmail.id;

                    if (googleUniqueId) {
                        await User.updateOne(
                            { id: existingUserByEmail.id },
                            { $set: { googleId: googleUniqueId } }
                        );
                    }
                } else {
                    // 2. 계정이 없으면 이메일을 ID로 사용하여 새 계정 생성
                    const secure_pwd = await bcrypt.hash('google', 10);
                    await User.create({
                        id: googleEmail,
                        pwd: secure_pwd,
                        name: googleName,
                        nickName: googleNickname,
                        userType: 'google',
                        googleId: googleUniqueId || '',
                    });
                    finalUserId = googleEmail;
                }
            }

            // 최종 사용자 정보 가져오기
            if (!user) {
                user = await User.findOne({ id: finalUserId }).lean();
            }

            const refreshJti = makeRefreshJti();
            const refreshExpiresAt = new Date(Date.now() + getRefreshTtlSeconds() * 1000);
            await RefreshToken.create({
                userId: finalUserId,
                jti: refreshJti,
                expiresAt: refreshExpiresAt,
            });

            const accessToken = signAccessToken({
                sub: finalUserId,
                userType: user?.userType || 'google',
                nickName: user ? user.nickName : googleNickname,
            });
            const refreshToken = signRefreshToken({ sub: finalUserId, jti: refreshJti });

            const userId = finalUserId;
            const name = (user ? user.name : googleName) || '';
            const nickName = (user ? user.nickName : googleNickname) || '';
            const tel = (user ? user.tel : '') || '';

            const redirectBase = process.env.FRONTEND_URL || process.env.SERVER_ADDRESS;
            res.redirect(
                `${redirectBase}/social/callback#accessToken=${encodeURIComponent(
                    accessToken
                )}&refreshToken=${encodeURIComponent(refreshToken)}&userId=${encodeURIComponent(
                    userId
                )}&name=${encodeURIComponent(name)}&nickName=${encodeURIComponent(
                    nickName
                )}&tel=${encodeURIComponent(tel)}`
            );
        } else {
            res.status(400).send('구글 인증 코드가 없습니다.');
        }
    } catch (err) {
        if (isDev) {
            logger.error('구글 로그인 중 오류 발생:', { error: err });
        }
        res.status(500).send('구글 로그인 중 오류가 발생했습니다.');
    }
});
