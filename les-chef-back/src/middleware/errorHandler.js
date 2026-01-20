/**
 * 전역 에러 핸들러 미들웨어
 * 모든 컨트롤러에서 발생하는 에러를 일관되게 처리
 */

const isDev = process.env.NODE_ENV !== 'production';

const errorHandler = (err, req, res, next) => {
    if (isDev) {
        console.error('Error:', err);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: true,
            message: '입력 데이터가 올바르지 않습니다.',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Mongoose cast error (잘못된 ID 형식)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: true,
            message: '잘못된 ID 형식입니다.'
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            error: true,
            message: '이미 존재하는 데이터입니다.'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: true,
            message: '인증 토큰이 유효하지 않습니다.'
        });
    }

    // 파일 시스템 에러
    if (err.code === 'ENOENT') {
        return res.status(404).json({
            error: true,
            message: '파일을 찾을 수 없습니다.'
        });
    }

    // 기본 서버 에러
    const statusCode = err.statusCode || 500;
    const message = err.message || '서버 오류가 발생했습니다.';

    res.status(statusCode).json({
        error: true,
        message: process.env.NODE_ENV === 'production' ? '서버 오류가 발생했습니다.' : message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;

