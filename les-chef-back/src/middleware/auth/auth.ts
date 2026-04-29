/**
 * 인증 미들웨어
 * JWT 기반 인증 체크 (Authorization: Bearer <accessToken>)
 */

import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../../types';
import { COMMON_ERROR_MESSAGES } from '../../constants/error/errorMessages';
import { verifyAccessToken, type AccessTokenPayload } from '../../utils/auth/token';

function getBearerToken(req: Request): string | null {
    const h = req.headers.authorization;
    if (!h) return null;
    const [kind, token] = h.split(' ');
    if (kind !== 'Bearer' || !token) return null;
    return token;
}

export const requireAuth = (
    req: Request,
    res: Response<ApiErrorResponse>,
    next: NextFunction
): void => {
    const token = getBearerToken(req);
    if (!token) {
        res.status(401).json({
            error: true,
            message: COMMON_ERROR_MESSAGES.UNAUTHORIZED,
        });
        return;
    }
    try {
        req.auth = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({
            error: true,
            message: COMMON_ERROR_MESSAGES.UNAUTHORIZED,
        });
    }
};

/**
 * 선택적(JWT) 인증 미들웨어
 * - Authorization: Bearer 토큰이 있으면 검증 후 req.auth 설정
 * - 토큰이 없거나 유효하지 않으면 그냥 next() (비로그인으로 처리)
 *
 * 공개 엔드포인트에서 "로그인 사용자에게만 추가 정보"를 내려줄 때 사용합니다.
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const token = getBearerToken(req);
    if (!token) {
        next();
        return;
    }
    try {
        req.auth = verifyAccessToken(token);
    } catch {
        // ignore invalid token for public endpoints
        req.auth = undefined;
    }
    next();
};

export const getUserId = (req: { auth?: AccessTokenPayload }): string => {
    if (!req.auth?.sub) {
        throw new Error('인증되지 않은 사용자입니다.');
    }
    return req.auth.sub;
};
