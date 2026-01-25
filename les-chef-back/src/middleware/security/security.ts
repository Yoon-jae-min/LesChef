/**
 * 보안 미들웨어
 * 입력 검증, sanitization, rate limiting 등
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../../constants';

/**
 * Rate Limiting 설정
 */
const createRateLimiter = (windowMs: number, max: number, message: string) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            error: true,
            message: message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// 일반 API 요청 제한
export const apiLimiter = createRateLimiter(
    RATE_LIMIT.API.WINDOW_MS,
    RATE_LIMIT.API.MAX,
    RATE_LIMIT.API.MESSAGE
);

// 인증 관련 요청 제한
export const authLimiter = createRateLimiter(
    RATE_LIMIT.AUTH.WINDOW_MS,
    RATE_LIMIT.AUTH.MAX,
    RATE_LIMIT.AUTH.MESSAGE
);

// 파일 업로드 제한
export const uploadLimiter = createRateLimiter(
    RATE_LIMIT.UPLOAD.WINDOW_MS,
    RATE_LIMIT.UPLOAD.MAX,
    RATE_LIMIT.UPLOAD.MESSAGE
);

/**
 * HTML 이스케이프 처리
 */
const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * 입력 sanitization
 */
export const sanitizeInput = (input: unknown): unknown => {
    if (typeof input === 'string') {
        // HTML 태그 제거 및 이스케이프
        return escapeHtml(input.trim());
    }
    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized: Record<string, unknown> = {};
        for (const key in input) {
            sanitized[key] = sanitizeInput((input as Record<string, unknown>)[key]);
        }
        return sanitized;
    }
    return input;
};

/**
 * 입력 검증 미들웨어
 */
export const validateInput = (req: Request, _res: Response, next: NextFunction): void => {
    // req.body sanitization
    if (req.body) {
        req.body = sanitizeInput(req.body) as typeof req.body;
    }
    
    // req.query sanitization
    if (req.query) {
        req.query = sanitizeInput(req.query) as typeof req.query;
    }
    
    next();
};

/**
 * JSON 파싱 안전성 검증
 */
export const safeJsonParse = (jsonString: unknown, maxLength: number = 1000000): unknown => {
    if (typeof jsonString !== 'string') {
        throw new Error('JSON 문자열이 아닙니다.');
    }
    
    // JSON 크기 제한 (1MB)
    if (jsonString.length > maxLength) {
        throw new Error('JSON 크기가 너무 큽니다.');
    }
    
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        throw new Error('잘못된 JSON 형식입니다.');
    }
};

/**
 * 이메일/아이디 검증
 */
export const validateEmailOrId = (value: unknown): boolean => {
    if (!value || typeof value !== 'string') {
        return false;
    }
    
    // 최소/최대 길이 검증
    if (value.length < 3 || value.length > 50) {
        return false;
    }
    
    // 특수문자 제한 (알파벳, 숫자, @, ., _, - 만 허용)
    return /^[a-zA-Z0-9@._-]+$/.test(value);
};

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: unknown): { valid: boolean; message?: string } => {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: '비밀번호를 입력해주세요.' };
    }
    
    if (password.length < 8) {
        return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    
    if (password.length > 128) {
        return { valid: false, message: '비밀번호는 128자 이하여야 합니다.' };
    }
    
    // 최소 하나의 숫자, 하나의 영문자 포함
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: '비밀번호에 최소 하나의 숫자가 포함되어야 합니다.' };
    }
    
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: '비밀번호에 최소 하나의 영문자가 포함되어야 합니다.' };
    }
    
    return { valid: true };
};

/**
 * 닉네임 검증
 */
export const validateNickname = (nickname: unknown): { valid: boolean; message?: string } => {
    if (!nickname || typeof nickname !== 'string') {
        return { valid: false, message: '닉네임을 입력해주세요.' };
    }
    
    const trimmed = nickname.trim();
    
    if (trimmed.length < 2 || trimmed.length > 20) {
        return { valid: false, message: '닉네임은 2자 이상 20자 이하여야 합니다.' };
    }
    
    // 특수문자 제한
    if (!/^[a-zA-Z0-9가-힣\s_-]+$/.test(trimmed)) {
        return { valid: false, message: '닉네임에 허용되지 않은 문자가 포함되어 있습니다.' };
    }
    
    return { valid: true };
};

