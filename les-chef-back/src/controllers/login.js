const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { validateEmailOrId } = require("../middleware/security");

//postLogin
const postLogin = asyncHandler(async (req, res) => {
    try {
        const { customerId, customerPwd } = req.body;

        // 입력 검증
        if (!customerId || !customerPwd) {
            return res.status(400).json({
                error: true,
                message: "아이디와 비밀번호를 입력해주세요."
            });
        }

        // 아이디 형식 검증
        if (!validateEmailOrId(customerId)) {
            return res.status(400).json({
                error: true,
                message: "아이디 형식이 올바르지 않습니다."
            });
        }

        // MongoDB Injection 방지 - Mongoose는 자동으로 처리하지만 명시적으로 검증
        const findUser = await User.findOne({ id: customerId }).lean();
        
        // 사용자 검증 (타이밍 공격 방지를 위해 항상 bcrypt.compare 실행)
        if (!findUser) {
            // 존재하지 않는 사용자도 동일한 시간이 걸리도록 더미 해시 비교
            await bcrypt.compare(customerPwd, '$2b$10$dummyhashforsecurity');
            return res.status(401).json({
                error: true,
                message: "아이디/비밀번호가 일치하지 않습니다."
            });
        }

        const isPasswordValid = await bcrypt.compare(customerPwd, findUser.pwd);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: "아이디/비밀번호가 일치하지 않습니다."
            });
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
            res.status(200).json({
                error: false,
                text: "login Success",
                id: findUser.id,
                name: findUser.name,
                nickName: findUser.nickName,
                tel: findUser.tel
            });
        });
    } catch (error) {
        console.error("로그인 처리 중 오류:", error);
        res.status(500).json({
            error: true,
            message: "서버 오류가 발생했습니다."
        });
    }
});

//getLogout
const getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("로그아웃 오류:", err);
            return res.status(500).json({
                error: true,
                message: "로그아웃 중 오류가 발생했습니다."
            });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            error: false,
            message: "Logged out"
        });
    });
}

//getAuth
const getAuth = (req, res) => {
    try {
        if (req.session?.user) {
            res.status(200).json({
                error: false,
                loggedIn: true,
            });
        } else {
            res.clearCookie('connect.sid');
            res.status(200).json({
                error: false,
                loggedIn: false
            });
        }
    } catch (error) {
        console.error("인증 확인 오류:", error);
        res.status(500).json({
            error: true,
            message: "인증 확인 중 오류가 발생했습니다.",
            loggedIn: false
        });
    }
}

//유저 정보 조회
const getInfo = asyncHandler(async(req, res) => {
    if(!req.session?.user?.id){
        return res.status(401).json({
            error: true,
            text: false,
            message: "로그인이 필요합니다."
        });
    }

    try {
        const userData = await User.findOne({id: req.session.user.id});

        if (!userData) {
            return res.status(404).json({
                error: true,
                text: false,
                message: "사용자를 찾을 수 없습니다."
            });
        }

        res.status(200).json({
            error: false,
            id: userData.id,
            nickName: userData.nickName,
            name: userData.name,
            tel: userData.tel,
            checkAdmin: userData.checkAdmin,
            text: true
        });
    } catch (error) {
        throw error;
    }
});

//유저 정보 변경
const infoChg = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다.",
            result: false
        });
    }

    const userId = req.session.user.id;
    const {nickName, tel} = req.body;

    if (!nickName) {
        return res.status(400).json({
            error: true,
            message: "닉네임은 필수입니다.",
            result: false
        });
    }

    try {
        const user = await User.findOne({id: userId});
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다.",
                result: false
            });
        }

        const result = await User.updateOne({id: userId},
            {$set: {
                nickName,
                tel: tel || ""
            }}
        );

        if(result.modifiedCount === 0){
            return res.status(400).json({
                error: true,
                message: "변경된 내용이 없습니다.",
                result: false
            });
        }

        res.status(200).json({
            error: false,
            message: "success",
            result: true
        });
    } catch (error) {
        throw error;
    }
});

//id 중복 확인
const idCheck = asyncHandler(async(req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            error: true,
            message: "아이디가 필요합니다."
        });
    }

    try {
        const user = await User.findOne({id: id});

        if(user){
            res.status(200).send("중복");
        }else{
            res.status(200).send("중복 아님");
        }
    } catch (error) {
        throw error;
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