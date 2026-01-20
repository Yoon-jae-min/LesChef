const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../../models/user/userModel");
const { getKakaoToken } = require("../../utils/external/kakao");
const logger = require("../../utils/logger");
const isDev = process.env.NODE_ENV !== 'production';

const kakaoLogin = asyncHandler(async(req, res) => {
    const {code} = req.query;

    try{
        if(code){
            const data = await getKakaoToken(code);

            if (!data.id_token) {
                return res.status(400).send("카카오 로그인 실패: id_token 없음");
            }

            const decodedIdToken = jwt.decode(data.id_token);
            const user = await User.findOne({id: "kakao_" + decodedIdToken.sub.toString()}).lean();

            if(!user){
                const secure_pwd = await bcrypt.hash("kakao", 10);
                await User.create({
                    id: "kakao_" + decodedIdToken.sub.toString(),
                    pwd: secure_pwd,
                    nickName: decodedIdToken.nickname,
                    userType: "kakao"
                });
            }

            req.session.user = {
                id: user ? user.id : decodedIdToken.sub,
                nickName: user ? user.nickName : decodedIdToken.nickName,
                userType: "kakao",
            };

            req.session.save((err) => {
                if (err) {
                    if (isDev) {
                        logger.error("세션 저장 오류:", { error: err });
                    }
                    return res.status(500).send("세션 저장 중 오류가 발생했습니다.");
                }
                res.redirect(`${process.env.SERVER_ADDRESS}/?userId=${user ? user.id : decodedIdToken.sub}&name=${user ? user.name : "user"}&nickName=${user ? user.nickName : decodedIdToken.nickName}&tel=${user ? user.tel : ""}`);
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

module.exports = {kakaoLogin};