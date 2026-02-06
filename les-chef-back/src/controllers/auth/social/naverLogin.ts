/**
 * 네이버 소셜 로그인 컨트롤러
 * 이메일 기반 계정 통합 지원
 */

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from "../../../models/user/userModel";
import { getNaverToken, getNaverUserInfo } from "../../../utils/external/naver";
import logger from "../../../utils/system/logger";

const isDev = process.env.NODE_ENV !== 'production';

export const naverLogin = asyncHandler(async(req: Request, res: Response) => {
    const {code, state} = req.query;

    try{
        if(code && typeof code === 'string' && state && typeof state === 'string'){
            // 네이버 토큰 가져오기
            const tokenData = await getNaverToken(code, state);

            if (!tokenData.access_token) {
                res.status(400).send("네이버 로그인 실패: access_token 없음");
                return;
            }

            // 네이버 사용자 정보 가져오기
            const naverUserInfo = await getNaverUserInfo(tokenData.access_token);
            
            if (naverUserInfo.resultcode !== '00' || !naverUserInfo.response) {
                res.status(400).send("네이버 로그인 실패: 사용자 정보 없음");
                return;
            }

            const naverResponse = naverUserInfo.response;
            const naverEmail = naverResponse.email;
            const naverName = naverResponse.name || "네이버사용자";
            const naverNickname = naverResponse.nickname || naverResponse.name || "네이버사용자";

            if (!naverEmail) {
                res.status(400).send("네이버 로그인 실패: 이메일 정보 없음");
                return;
            }

            // 이메일 기반 계정 통합 로직
            let user = null;
            let finalUserId: string;

            // 1. 해당 이메일로 가입된 계정이 있으면 연결
            const existingUserByEmail = await User.findOne({ id: naverEmail }).lean();
            if (existingUserByEmail) {
                // 기존 계정과 연결 (이메일 기반 통합)
                user = existingUserByEmail;
                finalUserId = existingUserByEmail.id;
            } else {
                // 2. 계정이 없으면 이메일을 ID로 사용하여 새 계정 생성
                const secure_pwd = await bcrypt.hash("naver", 10);
                await User.create({
                    id: naverEmail,
                    pwd: secure_pwd,
                    name: naverName,
                    nickName: naverNickname,
                    userType: "naver"
                });
                finalUserId = naverEmail;
            }

            // 최종 사용자 정보 가져오기
            if (!user) {
                user = await User.findOne({id: finalUserId}).lean();
            }

            req.session.user = {
                id: finalUserId,
                nickName: user ? user.nickName : naverNickname,
                userType: "naver",
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
                const name = user ? user.name : naverName;
                const nickName = user ? user.nickName : naverNickname;
                const tel = user ? user.tel : (naverResponse.mobile || "");

                const redirectBase = process.env.FRONTEND_URL || process.env.SERVER_ADDRESS;
                res.redirect(`${redirectBase}/?userId=${userId}&name=${name}&nickName=${nickName}&tel=${tel}`);
            });
        }else{
            res.status(400).send("네이버 인증 코드가 없습니다.");
        }
    }catch(err){
        if (isDev) {
            logger.error("네이버 로그인 중 오류 발생:", { error: err });
        }
        res.status(500).send("네이버 로그인 중 오류가 발생했습니다.");
    }
});

