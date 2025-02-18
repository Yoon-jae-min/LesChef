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

        req.session.user = {
            id: findUser.id,
            nickName: findUser.nickName,
            userType: "common"
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
        res.clearCookie('connect.sid');
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

//유저 정보 변경
const infoChg = asyncHandler(async(req, res) => {
    const userId = req.session.user.id;
    const {nickName, tel} = req.body;

    const result = await User.updateOne({id: userId},
        {$set: {
            nickName,
            tel
        }}
    );

    if(result.modifiedCount === 0){
        res.status(400).send({
            error: true,
            message: "update fail",
            result: false
        });
    }else{
        res.status(200).send({
            error: false,
            message: "success",
            result: true
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

//패스워드 변경
const pwdChg = asyncHandler(async(req, res) => {

});

//패스워드 체크
const pwCheck = asyncHandler(async(req, res) => {
    const userId = req.session?.user?.id;
    if(!userId){
        res.status(401).send({error: true, message: "session error"});
        return;
    }
    const {password} = req.body;
    if(!password){
        res.status(400).send({error: true, message: "password Null"});
        return;
    }
    const user = await User.findOne({id: userId}).lean();
    if(!user){
        res.status(404).send({error: true, message: "not found user"});
        return;
    }

    const result = await bcrypt.compare(password, user.pwd);
    res.status(200).send({
        error: false,
        message: "success",
        result: result
    });
});

module.exports = {postLogin, getLogout, getAuth, getInfo, infoChg, idCheck, pwdChg, pwCheck};