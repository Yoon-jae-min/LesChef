import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../../../models/user/userModel";
import Recipe from "../../../models/recipe/core/recipe";
import { unlinkKakaoUser } from "../../../utils/external/kakao";
import logger from "../../../utils/system/logger";
import { validateEmailOrId, validatePassword, validateNickname } from "../../../middleware/security/security";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../types";

const isDev = process.env.NODE_ENV !== 'production';

interface JoinRequestBody {
    id?: string;
    pwd?: string;
    name?: string;
    nickName?: string;
    tel?: string;
}

export const postJoin = asyncHandler(async (req: Request<{}, ApiSuccessResponse | ApiErrorResponse, JoinRequestBody>, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
    const { id, pwd, name, nickName, tel } = req.body;

    // 필수 필드 검증
    if (!id || !pwd || !nickName) {
        res.status(400).json({
            error: true,
            message: "아이디, 비밀번호, 닉네임은 필수입니다."
        });
        return;
    }

    // 아이디 형식 검증
    if (!validateEmailOrId(id)) {
        res.status(400).json({
            error: true,
            message: "아이디는 3자 이상 50자 이하의 영문, 숫자, 특수문자(@._-)만 사용 가능합니다."
        });
        return;
    }

    // 비밀번호 강도 검증
    const passwordValidation = validatePassword(pwd);
    if (!passwordValidation.valid) {
        res.status(400).json({
            error: true,
            message: passwordValidation.message || "비밀번호 검증 실패"
        });
        return;
    }

    // 닉네임 검증
    const nicknameValidation = validateNickname(nickName || "");
    if (!nicknameValidation.valid) {
        res.status(400).json({
            error: true,
            message: nicknameValidation.message || "닉네임 검증 실패"
        });
        return;
    }

    // 아이디 중복 확인
    const existingUser = await User.findOne({id: id});
    if (existingUser) {
        res.status(409).json({
            error: true,
            message: "이미 사용 중인 아이디입니다."
        });
        return;
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

export const delUser = asyncHandler(async(req: Request, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
    if (!req.session?.user?.id) {
        res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
        return;
    }

    const userId = req.session.user.id;
    const userType = req.session.user.userType;
    
    try {
        const user = await User.findOne({id: userId}).lean();
        
        if (!user) {
            res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다.",
                result: false
            });
            return;
        }

        const result = await User.deleteOne({id: userId});

        if(result.deletedCount === 0){
            res.status(500).json({
                error: true,
                message: "회원 탈퇴에 실패했습니다.",
                result: false
            });
            return;
        }

        if(!user.checkAdmin){
            await Recipe.updateMany({userId},
                {$set: {userId: null}}
            );
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

        req.session.destroy((err) => {
            if (err) {
                if (isDev) {
                    logger.error("세션 삭제 오류:", { error: err });
                }
                res.status(500).json({
                    error: true,
                    message: "세션 삭제 중 오류가 발생했습니다.",
                    result: false
                });
                return;
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

