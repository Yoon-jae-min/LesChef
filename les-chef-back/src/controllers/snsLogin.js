const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/userModel");

const kakaoLogin = asyncHandler(async(req, res) => {
    const {code} = req.query;

    try{
        if(code){
            const response = await fetch('https://kauth.kakao.com/oauth/token',{
                                method: "POST",
                                headers: {
                                    "Content-Type":"application/x-www-form-urlencoded;charset-utf"
                                },
                                body: new URLSearchParams({
                                    grant_type: 'authorization_code',
                                    client_id: process.env.KAKAO_API_KEY,
                                    redirect_uri: `${process.env.SERVER_ADDRESS}/customer/kakaoLogin`,
                                    code: code,
                                }),
                            });
            
            const data = await response.json();

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
                    console.error("세션 저장 오류:", err);
                    return res.status(500).send("세션 저장 중 오류가 발생했습니다.");
                }
                res.redirect(`${process.env.SERVER_ADDRESS}/?userId=${user ? user.id : decodedIdToken.sub}&name=${user ? user.name : "user"}&nickName=${user ? user.nickName : decodedIdToken.nickName}&tel=${user ? user.tel : ""}`);
            });
        }else{
            res.status(400).send("카카오 인증 코드가 없습니다.");
        }
    }catch(err){
        console.error("카카오 로그인 중 오류 발생:", err);
        res.status(500).send("카카오 로그인 중 오류가 발생했습니다.");
    }
});

module.exports = {kakaoLogin};