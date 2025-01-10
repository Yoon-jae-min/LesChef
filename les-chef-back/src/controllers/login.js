const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

//postLogin
const postLogin = asyncHandler(async (req, res) => {
    try {
        const findUser = await User.findOne({ id: req.body.customerId });
        let resText = "";

        // 사용자 검증
        if (!findUser || !await bcrypt.compare(req.body.customerPwd, findUser.pwd)) {
            return res.status(401).send("아이디/비밀번호가 일치하지 않습니다.");
        }

        // 세션에 사용자 정보 저장
        req.session.user = {
            id: findUser.id,
            nickName: findUser.nickName
        };

        // 세션 저장 후 응답
        req.session.save((err) => {
            if (err) {
                console.error("세션 저장 오류:", err);
                return res.status(500).send("세션 저장 중 오류가 발생했습니다.");
            }
            res.send({
                text: "login Success",
                id: findUser.id,
                name: findUser.name,
                nickName: findUser.nickName,
                tel: findUser.tel
            });
        });
    } catch (error) {
        console.error("로그인 처리 중 오류:", error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
});

//getLogout
const getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error logging out');
        res.clearCookie('connect.sid');
        res.status(200).send('Logged out');
    });
}

//getAuth
const getAuth = (req, res) => {
    if (req.session.user) {
        res.json({
            loggedIn: true,
        });
    } else {
        res.json({
            loggedIn: false
        });
    }
}

//유저 정보 조회
const getInfo = asyncHandler(async(req, res) => {
    if(req.session.user){
        const userData = await User.findOne({id: req.session.user.id});

        res.json({
            id: userData.id,
            nickName: userData.nickName,
            name: userData.name,
            tel: userData.tel,
            checkAdmin: userData.checkAdmin,
            text: true
        });
    }else{
        res.json({
            text: false
        });
    }
});

//id 중복 확인
const idCheck = asyncHandler(async(req, res) => {
    const user = await User.findOne({id: req.query.id});

    if(user){
        res.send("중복");
    }else{
        res.send("중복 아님");
    }
});

module.exports = {postLogin, getLogout, getAuth, getInfo, idCheck};