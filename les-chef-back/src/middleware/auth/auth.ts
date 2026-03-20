/**
 * 인증 미들웨어
 * 세션 기반 인증 체크
 */

import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../../types';
import { COMMON_ERROR_MESSAGES } from '../../constants/error/errorMessages';

/**
 * 인증된 사용자만 접근 가능한 미들웨어
 * 세션에 user.id가 없으면 401 에러 반환
 */
export const requireAuth = (
    req: Request,
    res: Response<ApiErrorResponse>,
    next: NextFunction
): void => {
    if (!req.session?.user?.id) {
        res.status(401).json({
            error: true,
            message: COMMON_ERROR_MESSAGES.UNAUTHORIZED,
        });
        return;
    }
    next();
};

/**
 * 인증된 사용자의 ID를 반환하는 헬퍼 함수
 * requireAuth 미들웨어 이후에 사용해야 함
 */
export const getUserId = (req: Request): string => {
    if (!req.session?.user?.id) {
        throw new Error('인증되지 않은 사용자입니다.');
    }
    return req.session.user.id;
};
