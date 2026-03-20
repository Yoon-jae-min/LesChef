/**
 * 아이디 찾기 · 비밀번호 재설정 (비로그인)
 * 본인확인(이름+전화번호 / 아이디+이름+전화번호) 후 처리
 */

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import { validateEmailOrId, validatePassword } from '../../../middleware/security/security';
import { ApiErrorResponse, ApiSuccessResponse } from '../../../types';
import logger from '../../../utils/system/logger';

const PASSWORD_RESET_JWT_EXPIRES = '15m';

function normalizeTel(raw: string): string {
    return String(raw).replace(/\D/g, '');
}

/** 전화번호만 숫자로 맞춰 User 조회 (이름 일치 + 전화번호 일치) */
async function findUserByNameAndTel(name: string, tel: string) {
    const trimmedName = name.trim();
    const telDigits = normalizeTel(tel);
    if (!trimmedName || telDigits.length < 9) {
        return null;
    }
    const candidates = await User.find({ name: trimmedName }).lean();
    return (
        candidates.find((u) => normalizeTel(u.tel || '') === telDigits) ?? null
    );
}

/** 로그인 아이디(이메일) 마스킹 */
function maskLoginId(id: string): string {
    if (!id) return '***';
    if (!id.includes('@')) {
        if (id.length <= 2) return `${id[0] ?? '*'}***`;
        return `${id.slice(0, 2)}***`;
    }
    const [local, domain] = id.split('@');
    if (!domain) return '***';
    const visible = local.length <= 1 ? 1 : 2;
    return `${local.slice(0, visible)}***@${domain}`;
}

function signPasswordResetToken(userLoginId: string): string {
    const secret = process.env.SESSION_SECRET_KEY;
    if (!secret) {
        throw new Error('SESSION_SECRET_KEY가 설정되지 않았습니다.');
    }
    return jwt.sign(
        { typ: 'pwd_reset', sub: userLoginId },
        secret,
        { expiresIn: PASSWORD_RESET_JWT_EXPIRES }
    );
}

function verifyPasswordResetToken(token: string): string | null {
    const secret = process.env.SESSION_SECRET_KEY;
    if (!secret) return null;
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        if (decoded.typ !== 'pwd_reset' || typeof decoded.sub !== 'string') {
            return null;
        }
        return decoded.sub;
    } catch {
        return null;
    }
}

interface FindIdBody {
    name?: string;
    tel?: string;
}

interface FindIdSuccess extends ApiSuccessResponse {
    maskedId: string;
}

/** POST /customer/findId — 이름 + 전화번호로 등록 아이디(마스킹) 안내 */
export const findIdByProfile = asyncHandler(
    async (
        req: Request<{}, FindIdSuccess | ApiErrorResponse, FindIdBody>,
        res: Response<FindIdSuccess | ApiErrorResponse>
    ) => {
        const { name, tel } = req.body;

        if (!name || !tel || typeof name !== 'string' || typeof tel !== 'string') {
            res.status(400).json({
                error: true,
                message: '이름과 전화번호를 입력해주세요.',
            });
            return;
        }

        try {
            const user = await findUserByNameAndTel(name, tel);
            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '일치하는 회원 정보가 없습니다.',
                });
                return;
            }

            res.status(200).json({
                error: false,
                maskedId: maskLoginId(user.id),
            });
        } catch (error) {
            logger.error('아이디 찾기 오류', { error });
            res.status(500).json({
                error: true,
                message: '처리 중 오류가 발생했습니다.',
            });
        }
    }
);

interface VerifyResetBody {
    id?: string;
    name?: string;
    tel?: string;
}

interface VerifyResetSuccess extends ApiSuccessResponse {
    resetToken: string;
    expiresInMinutes: number;
}

/** POST /customer/verifyPasswordReset — 아이디+이름+전화번호 일치 시 재설정용 JWT 발급 */
export const verifyPasswordReset = asyncHandler(
    async (
        req: Request<{}, VerifyResetSuccess | ApiErrorResponse, VerifyResetBody>,
        res: Response<VerifyResetSuccess | ApiErrorResponse>
    ) => {
        const { id, name, tel } = req.body;

        if (!id || !name || !tel) {
            res.status(400).json({
                error: true,
                message: '이메일(아이디), 이름, 전화번호를 모두 입력해주세요.',
            });
            return;
        }

        if (!validateEmailOrId(id)) {
            res.status(400).json({
                error: true,
                message: '아이디(이메일) 형식이 올바르지 않습니다.',
            });
            return;
        }

        try {
            const user = await User.findOne({ id: id.trim() }).lean();
            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '일치하는 회원 정보가 없습니다.',
                });
                return;
            }

            const nameOk = user.name?.trim() === String(name).trim();
            const telOk = normalizeTel(user.tel || '') === normalizeTel(tel);
            if (!nameOk || !telOk) {
                res.status(404).json({
                    error: true,
                    message: '일치하는 회원 정보가 없습니다.',
                });
                return;
            }

            const resetToken = signPasswordResetToken(user.id);

            res.status(200).json({
                error: false,
                resetToken,
                expiresInMinutes: 15,
            });
        } catch (error) {
            logger.error('비밀번호 재설정 본인확인 오류', { error });
            res.status(500).json({
                error: true,
                message: '처리 중 오류가 발생했습니다.',
            });
        }
    }
);

interface CompleteResetBody {
    resetToken?: string;
    newPwd?: string;
}

/** POST /customer/resetPassword — 본인확인 JWT + 새 비밀번호 */
export const completePasswordReset = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, CompleteResetBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const { resetToken, newPwd } = req.body;

        if (!resetToken || !newPwd) {
            res.status(400).json({
                error: true,
                message: '재설정 토큰과 새 비밀번호를 입력해주세요.',
            });
            return;
        }

        const loginId = verifyPasswordResetToken(resetToken);
        if (!loginId) {
            res.status(401).json({
                error: true,
                message: '재설정 시간이 만료되었거나 토큰이 유효하지 않습니다. 처음부터 다시 진행해주세요.',
            });
            return;
        }

        const pwdCheck = validatePassword(newPwd);
        if (!pwdCheck.valid) {
            res.status(400).json({
                error: true,
                message: pwdCheck.message || '비밀번호 형식이 올바르지 않습니다.',
            });
            return;
        }

        try {
            const user = await User.findOne({ id: loginId });
            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            const hashed = await bcrypt.hash(newPwd, 10);
            await User.updateOne({ id: loginId }, { $set: { pwd: hashed } });

            res.status(200).json({
                error: false,
                message: 'success',
            });
        } catch (error) {
            logger.error('비밀번호 재설정 완료 처리 오류', { error });
            res.status(500).json({
                error: true,
                message: '비밀번호 변경 중 오류가 발생했습니다.',
            });
        }
    }
);
