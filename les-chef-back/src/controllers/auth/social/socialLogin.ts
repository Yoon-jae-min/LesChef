import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from "../../../models/user/userModel";
import { getKakaoToken } from "../../../utils/external/kakao";
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

            const kakaoUserId = "kakao_" + decodedIdToken.sub.toString();
            const user = await User.findOne({id: kakaoUserId}).lean();

            if(!user){
                const secure_pwd = await bcrypt.hash("kakao", 10);
                await User.create({
                    id: kakaoUserId,
                    pwd: secure_pwd,
                    nickName: decodedIdToken.nickname || decodedIdToken.nickName || "카카오사용자",
                    userType: "kakao"
                });
            }

            req.session.user = {
                id: user ? user.id : kakaoUserId,
                nickName: user ? user.nickName : (decodedIdToken.nickname || decodedIdToken.nickName || "카카오사용자"),
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
                const userId = user ? user.id : kakaoUserId;
                const name = user ? user.name : "user";
                const nickName = user ? user.nickName : (decodedIdToken.nickname || decodedIdToken.nickName || "카카오사용자");
                const tel = user ? user.tel : "";
                res.redirect(`${process.env.SERVER_ADDRESS}/?userId=${userId}&name=${name}&nickName=${nickName}&tel=${tel}`);
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

