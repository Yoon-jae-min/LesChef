const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../../models/user/userModel");
const Recipe = require("../../models/recipe/recipeModel");
const { response } = require("express");
const isDev = process.env.NODE_ENV !== 'production';
const { unlinkKakaoUser } = require("../../utils/external/kakao");
const logger = require("../../utils/logger");

const { validateEmailOrId, validatePassword, validateNickname } = require("../../middleware/security");

const postJoin = asyncHandler(async (req, res) => {
    const { id, pwd, name, nickName, tel } = req.body;

    // 필수 필드 검증
    if (!id || !pwd || !nickName) {
        return res.status(400).json({
            error: true,
            message: "아이디, 비밀번호, 닉네임은 필수입니다."
        });
    }

    // 아이디 형식 검증
    if (!validateEmailOrId(id)) {
        return res.status(400).json({
            error: true,
            message: "아이디는 3자 이상 50자 이하의 영문, 숫자, 특수문자(@._-)만 사용 가능합니다."
        });
    }

    // 비밀번호 강도 검증
    const passwordValidation = validatePassword(pwd);
    if (!passwordValidation.valid) {
        return res.status(400).json({
            error: true,
            message: passwordValidation.message
        });
    }

    // 닉네임 검증
    const nicknameValidation = validateNickname(nickName);
    if (!nicknameValidation.valid) {
        return res.status(400).json({
            error: true,
            message: nicknameValidation.message
        });
    }

    // 아이디 중복 확인
    const existingUser = await User.findOne({id: id});
    if (existingUser) {
        return res.status(409).json({
            error: true,
            message: "이미 사용 중인 아이디입니다."
        });
    }

    try {
        const secure_pwd = await bcrypt.hash(pwd, 10);

        await User.create({
            id, 
            pwd: secure_pwd, 
            name: name || "user", 
            nickName, 
            tel: tel || "",
            userType: "common"
        });
        
        res.status(200).json({
            error: false,
            message: "ok"
        });
    } catch (error) {
        throw error;
    }
});

const delUser = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const userId = req.session.user.id;
    const userType = req.session.user.userType;
    
    try {
        const user = await User.findOne({id: userId}).lean();
        
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다.",
                result: false
            });
        }

        const result = await User.deleteOne({id: userId});

        if(result.deletedCount === 0){
            return res.status(500).json({
                error: true,
                message: "회원 탈퇴에 실패했습니다.",
                result: false
            });
        }

        if(!user.checkAdmin){
            await Recipe.updateMany({userId},
                {$set: {userId: null}}
            )
        }

        // 카카오 로그인 사용자인 경우 카카오 API 호출
        if(userType !== "common"){
            try {
                await unlinkKakaoUser(userId);
            } catch (kakaoErr) {
                if (isDev) {
                    logger.error("카카오 연동 해제 오류:", { error: kakaoErr });
                }
                // 카카오 연동 해제 실패해도 회원 탈퇴는 진행
            }
        }

        req.session.destroy(err => {
            if (err) {
                if (isDev) {
                    logger.error("세션 삭제 오류:", { error: err });
                }
                return res.status(500).json({
                    error: true,
                    message: "세션 삭제 중 오류가 발생했습니다.",
                    result: false
                });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({
                error: false,
                message: "회원 탈퇴가 완료되었습니다.",
                result: true
            });
        });
    } catch (error) {
        throw error;
    }
});

module.exports = {postJoin, delUser};