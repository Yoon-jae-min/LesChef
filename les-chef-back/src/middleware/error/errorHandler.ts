/**
 * 전역 에러 핸들러 미들웨어
 * 모든 컨트롤러에서 발생하는 에러를 일관되게 처리
 */

import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../../types';
import logger from '../../utils/system/logger';
import {
    COMMON_ERROR_MESSAGES,
    RESOURCE_ERROR_MESSAGES,
    HTTP_STATUS_MESSAGES,
    getFieldName,
} from '../../constants/error/errorMessages';

const isDev = process.env.NODE_ENV !== 'production';

interface CustomError extends Error {
    statusCode?: number;
    details?: unknown;
    field?: string;
    value?: unknown;
    duplicateValue?: unknown;
    path?: string;
    maxSize?: number;
    maxCount?: number;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { path: string; message: string; value: unknown }>;
}

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response<ApiErrorResponse>,
    _next: NextFunction
): void => {
    // 에러 로깅
    logger.error('API Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
    });

    // Mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
        const details = Object.values(err.errors).map((e) => {
            const fieldName = getFieldName(e.path);
            return {
                field: e.path,
                fieldName: fieldName,
                message: e.message.replace(e.path, fieldName),
                value: e.value,
            };
        });

        // 첫 번째 에러 필드의 한글명 사용
        const firstField = details[0]?.fieldName || '입력 항목';
        const message =
            details.length === 1
                ? `${firstField}을(를) 확인해주세요.`
                : COMMON_ERROR_MESSAGES.VALIDATION_ERROR;

        res.status(400).json({
            error: true,
            message: message,
            details: details,
        });
        return;
    }

    // Mongoose cast error (잘못된 ID 형식)
    if (err.name === 'CastError') {
        const fieldName = err.path ? getFieldName(err.path) : 'ID';
        res.status(400).json({
            error: true,
            message: `잘못된 ${fieldName} 형식입니다.`,
            field: err.path,
            fieldName: fieldName,
            value: err.value,
        });
        return;
    }

    // Mongoose duplicate key error
    if ((err as unknown as { code?: number }).code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'unknown';
        const fieldName = getFieldName(field);
        const duplicateValue = err.keyValue?.[field];

        // 리소스별 메시지 확인
        let message = `이미 사용 중인 ${fieldName}입니다.`;
        if (field === 'id' && RESOURCE_ERROR_MESSAGES.USER.DUPLICATE_ID) {
            message = RESOURCE_ERROR_MESSAGES.USER.DUPLICATE_ID;
        } else if (field === 'recipeName' && RESOURCE_ERROR_MESSAGES.RECIPE.DUPLICATE_NAME) {
            message = RESOURCE_ERROR_MESSAGES.RECIPE.DUPLICATE_NAME;
        }

        res.status(409).json({
            error: true,
            message: message,
            field: field,
            fieldName: fieldName,
            duplicateValue: duplicateValue,
        });
        return;
    }

    // MongoDB connection error
    if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError') {
        res.status(503).json({
            error: true,
            message: COMMON_ERROR_MESSAGES.DATABASE_ERROR,
            ...(isDev && { originalError: err.message }),
        });
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: true,
            message: '인증 토큰이 유효하지 않습니다.',
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            error: true,
            message: '인증 토큰이 만료되었습니다.',
        });
        return;
    }

    // 파일 시스템 에러
    const errorCode = (err as unknown as { code?: string }).code;
    if (errorCode === 'ENOENT') {
        res.status(404).json({
            error: true,
            message: RESOURCE_ERROR_MESSAGES.FILE.NOT_FOUND,
            path: err.path,
        });
        return;
    }

    if (errorCode === 'EACCES' || errorCode === 'EPERM') {
        res.status(403).json({
            error: true,
            message: COMMON_ERROR_MESSAGES.FORBIDDEN,
        });
        return;
    }

    // Multer 파일 업로드 에러
    if (errorCode === 'LIMIT_FILE_SIZE') {
        const maxSizeMB = err.maxSize ? Math.round(err.maxSize / (1024 * 1024)) : 10;
        res.status(400).json({
            error: true,
            message: `파일 크기가 너무 큽니다. (최대 ${maxSizeMB}MB)`,
            maxSize: err.maxSize,
            maxSizeMB: maxSizeMB,
        });
        return;
    }

    if (errorCode === 'LIMIT_FILE_COUNT') {
        res.status(400).json({
            error: true,
            message: RESOURCE_ERROR_MESSAGES.FILE.TOO_MANY,
            maxCount: err.maxCount,
        });
        return;
    }

    // 사용자 정의 에러 (statusCode와 message가 있는 경우)
    if (err.statusCode && err.message) {
        const errorResponse: ApiErrorResponse = {
            error: true,
            message: err.message,
        };
        if (err.details !== undefined) {
            errorResponse.details = err.details as ApiErrorResponse['details'];
        }
        if (err.field) {
            errorResponse.field = err.field;
        }
        res.status(err.statusCode).json(errorResponse);
        return;
    }

    // 기본 서버 에러
    const statusCode = err.statusCode || 500;
    const defaultMessage = HTTP_STATUS_MESSAGES[statusCode] || COMMON_ERROR_MESSAGES.SERVER_ERROR;
    const message = err.message || defaultMessage;

    const errorResponse: ApiErrorResponse = {
        error: true,
        message: isDev ? message : defaultMessage,
    };

    if (isDev) {
        if (err.stack) {
            errorResponse.stack = err.stack;
        }
        if (err.message && err.message !== message) {
            errorResponse.originalError = err.message;
        }
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
