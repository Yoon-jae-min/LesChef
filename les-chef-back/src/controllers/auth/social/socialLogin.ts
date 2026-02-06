import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from "../../../models/user/userModel";
import { getKakaoToken, getKakaoUserInfo } from "../../../utils/external/kakao";
import logger from "../../../utils/system/logger";

const isDev = process.env.NODE_ENV !== 'production';

interface KakaoTokenData {
    id_token?: string;
    access_token?: string;
    [key: string]: unknown;
}

interface DecodedIdToken {
    sub: string;
    nickname?: string;
    nickName?: string;
    [key: string]: unknown;
}

export const kakaoLogin = asyncHandler(async(req: Request, res: Response) => {
    const {code} = req.query;

    try{
        if(code && typeof code === 'string'){
            const data = await getKakaoToken(code) as KakaoTokenData;

            if (!data.id_token) {
                res.status(400).send("카카오 로그인 실패: id_token 없음");
                return;
            }

            const decodedIdToken = jwt.decode(data.id_token) as DecodedIdToken | null;
            if (!decodedIdToken || !decodedIdToken.sub) {
                res.status(400).send("카카오 로그인 실패: 토큰 디코딩 오류");
                return;
            }

            // 카카오 사용자 정보 가져오기 (이메일 포함)
            let kakaoEmail: string | null = null;
            let kakaoNickname: string | null = null;
            
            if (data.access_token) {
                try {
                    const userInfo = await getKakaoUserInfo(data.access_token);
                    kakaoEmail = userInfo.kakao_account?.email || null;
                    kakaoNickname = userInfo.kakao_account?.profile?.nickname 
                        || userInfo.properties?.nickname 
                        || decodedIdToken.nickname 
                        || decodedIdToken.nickName 
                        || "카카오사용자";
                } catch (error) {
                    if (isDev) {
                        logger.warn("카카오 사용자 정보 가져오기 실패 (이메일 없이 진행)", { error });
                    }
                    kakaoNickname = decodedIdToken.nickname || decodedIdToken.nickName || "카카오사용자";
                }
            } else {
                kakaoNickname = decodedIdToken.nickname || decodedIdToken.nickName || "카카오사용자";
            }

            // 이메일 기반 계정 통합 로직
            let user = null;
            let finalUserId: string;

            // 1. 이메일이 있고, 해당 이메일로 가입된 계정이 있으면 연결
            if (kakaoEmail) {
                const existingUserByEmail = await User.findOne({ id: kakaoEmail }).lean();
                if (existingUserByEmail) {
                    // 기존 계정과 연결 (이메일 기반 통합)
                    user = existingUserByEmail;
                    finalUserId = existingUserByEmail.id;
                } else {
                    // 2. 이메일이 있지만 계정이 없으면 이메일을 ID로 사용하여 새 계정 생성
                    const secure_pwd = await bcrypt.hash("kakao", 10);
                    await User.create({
                        id: kakaoEmail,
                        pwd: secure_pwd,
                        nickName: kakaoNickname,
                        userType: "kakao"
                    });
                    finalUserId = kakaoEmail;
                }
            } else {
                // 3. 이메일이 없으면 기존 방식대로 kakao_123456 형식 사용
                const kakaoUserId = "kakao_" + decodedIdToken.sub.toString();
                user = await User.findOne({id: kakaoUserId}).lean();

                if(!user){
                    const secure_pwd = await bcrypt.hash("kakao", 10);
                    await User.create({
                        id: kakaoUserId,
                        pwd: secure_pwd,
                        nickName: kakaoNickname,
                        userType: "kakao"
                    });
                }
                finalUserId = user ? user.id : kakaoUserId;
            }

            // 최종 사용자 정보 가져오기
            if (!user) {
                user = await User.findOne({id: finalUserId}).lean();
            }

            req.session.user = {
                id: finalUserId,
                nickName: user ? user.nickName : kakaoNickname,
                userType: "kakao",
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
                const name = user ? user.name : "user";
                const nickName = user ? user.nickName : kakaoNickname;
                const tel = user ? user.tel : "";

                // 프론트엔드 주소로 리다이렉트 (없으면 SERVER_ADDRESS fallback)
                const redirectBase = process.env.FRONTEND_URL || process.env.SERVER_ADDRESS;
                res.redirect(`${redirectBase}/?userId=${userId}&name=${name}&nickName=${nickName}&tel=${tel}`);
            });
        }else{
            res.status(400).send("카카오 인증 코드가 없습니다.");
        }
    }catch(err){
        if (isDev) {
            logger.error("카카오 로그인 중 오류 발생:", { error: err });
        }
        res.status(500).send("카카오 로그인 중 오류가 발생했습니다.");
    }
});

