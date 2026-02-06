/**
 * 구글 소셜 로그인 컨트롤러
 * 이메일 기반 계정 통합 지원
 */

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from "../../../models/user/userModel";
import { getGoogleToken, getGoogleUserInfo } from "../../../utils/external/google";
import logger from "../../../utils/system/logger";

const isDev = process.env.NODE_ENV !== 'production';

export const googleLogin = asyncHandler(async(req: Request, res: Response) => {
    const {code} = req.query;

    try{
        if(code && typeof code === 'string'){
            // 구글 토큰 가져오기
            const tokenData = await getGoogleToken(code);

            if (!tokenData.access_token) {
                res.status(400).send("구글 로그인 실패: access_token 없음");
                return;
            }

            // 구글 사용자 정보 가져오기
            const googleUserInfo = await getGoogleUserInfo(tokenData.access_token);
            
            if (!googleUserInfo.email) {
                res.status(400).send("구글 로그인 실패: 이메일 정보 없음");
                return;
            }

            const googleEmail = googleUserInfo.email;
            const googleName = googleUserInfo.name || googleUserInfo.given_name || "구글사용자";
            const googleNickname = googleUserInfo.given_name || googleUserInfo.name || "구글사용자";

            // 이메일 기반 계정 통합 로직
            let user = null;
            let finalUserId: string;

            // 1. 해당 이메일로 가입된 계정이 있으면 연결
            const existingUserByEmail = await User.findOne({ id: googleEmail }).lean();
            if (existingUserByEmail) {
                // 기존 계정과 연결 (이메일 기반 통합)
                user = existingUserByEmail;
                finalUserId = existingUserByEmail.id;
            } else {
                // 2. 계정이 없으면 이메일을 ID로 사용하여 새 계정 생성
                const secure_pwd = await bcrypt.hash("google", 10);
                await User.create({
                    id: googleEmail,
                    pwd: secure_pwd,
                    name: googleName,
                    nickName: googleNickname,
                    userType: "google"
                });
                finalUserId = googleEmail;
            }

            // 최종 사용자 정보 가져오기
            if (!user) {
                user = await User.findOne({id: finalUserId}).lean();
            }

            req.session.user = {
                id: finalUserId,
                nickName: user ? user.nickName : googleNickname,
                userType: "google",
            };

            req.session.save((err) => {
                if (err) {
                    if (isDev) {
                        logger.error("세션 저장 오류:", { error: err });
                    }
                    res.status(500).send("세션 저장 중 오류가 발생했습니다.");
                    return;
                }
                const userId = finalUserId;
                const name = user ? user.name : googleName;
                const nickName = user ? user.nickName : googleNickname;
                const tel = user ? user.tel : "";

                const redirectBase = process.env.FRONTEND_URL || process.env.SERVER_ADDRESS;
                res.redirect(`${redirectBase}/?userId=${userId}&name=${name}&nickName=${nickName}&tel=${tel}`);
            });
        }else{
            res.status(400).send("구글 인증 코드가 없습니다.");
        }
    }catch(err){
        if (isDev) {
            logger.error("구글 로그인 중 오류 발생:", { error: err });
        }
        res.status(500).send("구글 로그인 중 오류가 발생했습니다.");
    }
});

