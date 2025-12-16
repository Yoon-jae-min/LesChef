/**
 * 보안 미들웨어
 * 입력 검증, sanitization, rate limiting 등
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting 설정
 */
const createRateLimiter = (windowMs, max, message) => {
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

// 일반 API 요청 제한 (15분에 100회)
const apiLimiter = createRateLimiter(
    15 * 60 * 1000,
    100,
    '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
);

// 인증 관련 요청 제한 (15분에 5회)
const authLimiter = createRateLimiter(
    15 * 60 * 1000,
    5,
    '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.'
);

// 파일 업로드 제한 (1시간에 20회)
const uploadLimiter = createRateLimiter(
    60 * 60 * 1000,
    20,
    '파일 업로드 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.'
);

/**
 * HTML 이스케이프 처리
 */
const escapeHtml = (text) => {
    const map = {
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
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        // HTML 태그 제거 및 이스케이프
        return escapeHtml(input.trim());
    }
    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const key in input) {
            sanitized[key] = sanitizeInput(input[key]);
        }
        return sanitized;
    }
    return input;
};

/**
 * 입력 검증 미들웨어
 */
const validateInput = (req, res, next) => {
    // req.body sanitization
    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    
    // req.query sanitization
    if (req.query) {
        req.query = sanitizeInput(req.query);
    }
    
    next();
};

/**
 * JSON 파싱 안전성 검증
 */
const safeJsonParse = (jsonString, maxLength = 1000000) => {
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
const validateEmailOrId = (value) => {
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
const validatePassword = (password) => {
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
const validateNickname = (nickname) => {
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

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    validateInput,
    safeJsonParse,
    validateEmailOrId,
    validatePassword,
    validateNickname,
    sanitizeInput
};

