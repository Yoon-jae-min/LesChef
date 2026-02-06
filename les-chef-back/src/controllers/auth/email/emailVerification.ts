/**
 * 이메일 인증 관련 컨트롤러
 * 인증 코드 발송 및 검증
 */

import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import EmailVerification from "../../../models/user/emailVerificationModel";
import { sendVerificationCode } from "../../../utils/email/emailService";
import { validateEmailOrId } from "../../../middleware/security/security";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../types";
import logger from "../../../utils/system/logger";

const isDev = process.env.NODE_ENV !== 'production';

/**
 * 인증 코드 생성 (6자리 숫자)
 */
const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 인증 코드 발송
 * POST /customer/sendVerificationCode
 */
export const sendVerificationCodeController = asyncHandler(
    async (req: Request<{}, ApiSuccessResponse | ApiErrorResponse, { email: string }>, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        const { email } = req.body;

        // 이메일 필수 검증
        if (!email) {
            res.status(400).json({
                error: true,
                message: "이메일을 입력해주세요."
            });
            return;
        }

        // 이메일 형식 검증
        if (!validateEmailOrId(email)) {
            res.status(400).json({
                error: true,
                message: "올바른 이메일 형식이 아닙니다."
            });
            return;
        }

        try {
            // 기존 미인증 코드 삭제 (같은 이메일로 여러 번 요청한 경우)
            await EmailVerification.deleteMany({
                email: email,
                verified: false
            });

            // 새 인증 코드 생성
            const code = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

            // DB에 저장
            await EmailVerification.create({
                email: email,
                code: code,
                expiresAt: expiresAt,
                verified: false
            });

            // 이메일 발송
            await sendVerificationCode(email, code);

            res.status(200).json({
                error: false,
                message: "인증 코드가 발송되었습니다."
            });
        } catch (error) {
            if (isDev) {
                logger.error("인증 코드 발송 실패", { error, email });
            }
            res.status(500).json({
                error: true,
                message: "인증 코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요."
            });
        }
    }
);

/**
 * 인증 코드 검증
 * POST /customer/verifyEmailCode
 */
export const verifyEmailCodeController = asyncHandler(
    async (req: Request<{}, ApiSuccessResponse | ApiErrorResponse, { email: string; code: string }>, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        const { email, code } = req.body;

        // 필수 필드 검증
        if (!email || !code) {
            res.status(400).json({
                error: true,
                message: "이메일과 인증 코드를 입력해주세요."
            });
            return;
        }

        try {
            // 인증 코드 조회
            const verification = await EmailVerification.findOne({
                email: email,
                code: code,
                verified: false
            });

            // 인증 코드가 없거나 만료된 경우
            if (!verification) {
                res.status(400).json({
                    error: true,
                    message: "인증 코드가 올바르지 않거나 만료되었습니다."
                });
                return;
            }

            // 만료 시간 체크
            if (verification.expiresAt < new Date()) {
                await EmailVerification.deleteOne({ _id: verification._id });
                res.status(400).json({
                    error: true,
                    message: "인증 코드가 만료되었습니다. 다시 발송해주세요."
                });
                return;
            }

            // 인증 완료 처리
            verification.verified = true;
            await verification.save();

            res.status(200).json({
                error: false,
                message: "이메일 인증이 완료되었습니다."
            });
        } catch (error) {
            if (isDev) {
                logger.error("인증 코드 검증 실패", { error, email });
            }
            res.status(500).json({
                error: true,
                message: "인증 코드 검증에 실패했습니다."
            });
        }
    }
);

