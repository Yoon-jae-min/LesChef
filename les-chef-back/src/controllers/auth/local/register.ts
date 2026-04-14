import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import Recipe from '../../../models/recipe/core/recipe';
import EmailVerification from '../../../models/user/emailVerificationModel';
import { unlinkKakaoUser } from '../../../utils/external/kakao';
import { deleteFoodsDataForUser } from '../../../utils/foods/foodsItemImageDelete';
import logger from '../../../utils/system/logger';
import {
    validateLoginId,
    validatePassword,
    validateNickname,
    isValidEmailAddress,
} from '../../../middleware/security/security';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';

const isDev = process.env.NODE_ENV !== 'production';

interface JoinRequestBody {
    id?: string;
    email?: string;
    pwd?: string;
    name?: string;
    nickName?: string;
    tel?: string;
}

const normalizeEmail = (raw: string): string => raw.trim().toLowerCase();

export const postJoin = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, JoinRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const { id, email, pwd, name, nickName, tel } = req.body;

        // 필수 필드 검증
        if (!id || !email || !pwd || !nickName) {
            res.status(400).json({
                error: true,
                message: '아이디, 이메일, 비밀번호, 닉네임은 필수입니다.',
            });
            return;
        }

        const idTrim = id.trim();
        const emailNorm = normalizeEmail(email);

        if (!validateLoginId(idTrim)) {
            res.status(400).json({
                error: true,
                message:
                    '아이디는 3자 이상 50자 이하이며, 영문과 숫자만 사용할 수 있고 이메일 형식(@)은 사용할 수 없습니다.',
            });
            return;
        }

        if (!isValidEmailAddress(emailNorm)) {
            res.status(400).json({
                error: true,
                message: '올바른 이메일 주소를 입력해주세요.',
            });
            return;
        }

        // 비밀번호 강도 검증
        const passwordValidation = validatePassword(pwd);
        if (!passwordValidation.valid) {
            res.status(400).json({
                error: true,
                message: passwordValidation.message || '비밀번호 검증 실패',
            });
            return;
        }

        // 닉네임 검증
        const nicknameValidation = validateNickname(nickName || '');
        if (!nicknameValidation.valid) {
            res.status(400).json({
                error: true,
                message: nicknameValidation.message || '닉네임 검증 실패',
            });
            return;
        }

        const existingByIdOrEmail = await User.findOne({
            $or: [{ id: idTrim }, { email: emailNorm }],
        });
        if (existingByIdOrEmail) {
            const takenById = existingByIdOrEmail.id === idTrim;
            res.status(409).json({
                error: true,
                message: takenById
                    ? '이미 사용 중인 아이디입니다.'
                    : '이미 사용 중인 이메일입니다.',
            });
            return;
        }

        const emailVerification = await EmailVerification.findOne({
            email: emailNorm,
            verified: true,
        });

        if (!emailVerification) {
            res.status(400).json({
                error: true,
                message:
                    '이메일 인증이 완료되지 않았습니다. 인증 코드를 발송하고 인증을 완료해주세요.',
            });
            return;
        }

        await EmailVerification.deleteOne({ _id: emailVerification._id });

        try {
            const secure_pwd = await bcrypt.hash(pwd, 10);

            await User.create({
                id: idTrim,
                email: emailNorm,
                pwd: secure_pwd,
                name: name || 'user',
                nickName,
                tel: tel || '',
                userType: 'common',
            });

            res.status(200).json({
                error: false,
                message: 'ok',
            });
        } catch (error) {
            throw error;
        }
    }
);

interface DeleteUserRequestBody {
    password?: string;
    reason?: string;
    customReason?: string;
}

const SESSION_COOKIE_CLEAR_OPTS = {
    path: '/' as const,
    signed: true as const,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
};

export const delUser = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, DeleteUserRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const userId = req.session.user.id;

        try {
            const user = await User.findOne({ id: userId }).lean();

            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                    result: false,
                });
                return;
            }

            const accountUserType = user.userType || 'common';
            const needsPassword = accountUserType === 'common';

            if (needsPassword) {
                const pwd = req.body?.password;
                if (!pwd || typeof pwd !== 'string') {
                    res.status(400).json({
                        error: true,
                        message: '비밀번호를 입력해주세요.',
                        result: false,
                    });
                    return;
                }
                const match = await bcrypt.compare(pwd, user.pwd);
                if (!match) {
                    res.status(401).json({
                        error: true,
                        message: '비밀번호가 일치하지 않습니다.',
                        result: false,
                    });
                    return;
                }
            }

            const reasonRaw = req.body?.reason;
            const customRaw = req.body?.customReason;
            const reason =
                typeof reasonRaw === 'string' ? reasonRaw.trim().slice(0, 200) : '';
            const customReason =
                typeof customRaw === 'string' ? customRaw.trim().slice(0, 500) : '';
            if (reason || customReason) {
                logger.info('회원 탈퇴 사유', {
                    userId,
                    reason: reason || undefined,
                    customReason: customReason || undefined,
                });
            }

            const result = await User.deleteOne({ id: userId });

            if (result.deletedCount === 0) {
                res.status(500).json({
                    error: true,
                    message: '회원 탈퇴에 실패했습니다.',
                    result: false,
                });
                return;
            }

            if (!user.checkAdmin) {
                await Recipe.updateMany({ userId }, { $set: { userId: null } });
            }

            await deleteFoodsDataForUser(userId);

            // 카카오 연동이 있는 경우에만 카카오 API 연동 해제 시도 (id 형식 제약으로 실패할 수 있음)
            if (user.kakaoId && userId.startsWith('kakao_')) {
                try {
                    await unlinkKakaoUser(userId);
                } catch (kakaoErr) {
                    if (isDev) {
                        logger.error('카카오 연동 해제 오류:', { error: kakaoErr });
                    }
                }
            }

            req.session.destroy((err) => {
                if (err) {
                    logger.warn(
                        '세션 저장소 삭제 실패(회원 DB 삭제는 완료). 쿠키를 지우고 성공 응답을 보냅니다.',
                        { error: err }
                    );
                }
                res.clearCookie('sessionId', SESSION_COOKIE_CLEAR_OPTS);
                res.status(200).json({
                    error: false,
                    message: '회원 탈퇴가 완료되었습니다.',
                    result: true,
                });
            });
        } catch (error) {
            throw error;
        }
    }
);
