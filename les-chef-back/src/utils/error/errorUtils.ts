/**
 * 에러 처리 유틸리티 함수
 * 컨트롤러에서 발생하는 에러를 구체적인 메시지로 변환
 */

interface CustomError extends Error {
    statusCode?: number;
    details?: string | string[] | Array<{ field: string; message: string; value?: unknown }>;
    field?: string;
    value?: unknown;
    duplicateValue?: unknown;
    path?: string;
    maxSize?: number;
    maxCount?: number;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { path: string; message: string; value: unknown }>;
    code?: number | string;
}

interface ErrorOptions {
    resourceName?: string;
    fileType?: string;
    defaultMessage?: string;
}

/**
 * MongoDB 에러를 사용자 친화적인 에러로 변환
 * @param error 원본 에러
 * @param resourceName 리소스 이름 (예: "레시피", "게시글")
 * @returns 변환된 에러
 */
export const handleMongoError = (error: CustomError, resourceName: string = "데이터"): CustomError => {
    if (error.name === 'CastError') {
        const customError = new Error(`잘못된 ${resourceName} ID 형식입니다.`) as CustomError;
        customError.statusCode = 400;
        customError.field = error.path;
        customError.value = error.value;
        return customError;
    }

    if (error.name === 'ValidationError' && error.errors) {
        const customError = new Error(`${resourceName} 데이터 검증에 실패했습니다.`) as CustomError;
        customError.statusCode = 400;
        customError.details = Object.values(error.errors).map(e => ({
            field: e.path,
            message: e.message,
            value: e.value
        }));
        return customError;
    }

    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'unknown';
        const customError = new Error(`이미 존재하는 ${field}입니다.`) as CustomError;
        customError.statusCode = 409;
        customError.field = field;
        customError.duplicateValue = error.keyValue?.[field];
        return customError;
    }

    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
        const customError = new Error(`${resourceName} 조회 중 데이터베이스 오류가 발생했습니다.`) as CustomError;
        customError.statusCode = 503;
        return customError;
    }

    return error;
};

/**
 * 파일 시스템 에러를 사용자 친화적인 에러로 변환
 * @param error 원본 에러
 * @param fileType 파일 타입 (예: "이미지", "파일")
 * @returns 변환된 에러
 */
export const handleFileError = (error: CustomError, fileType: string = "파일"): CustomError => {
    if (error.code === 'ENOENT') {
        const customError = new Error(`${fileType}을(를) 찾을 수 없습니다.`) as CustomError;
        customError.statusCode = 404;
        customError.path = error.path;
        return customError;
    }

    if (error.code === 'EACCES' || error.code === 'EPERM') {
        const customError = new Error(`${fileType} 접근 권한이 없습니다.`) as CustomError;
        customError.statusCode = 403;
        return customError;
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
        const customError = new Error(`${fileType} 크기가 너무 큽니다.`) as CustomError;
        customError.statusCode = 400;
        customError.maxSize = error.maxSize;
        return customError;
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
        const customError = new Error(`${fileType} 개수가 너무 많습니다.`) as CustomError;
        customError.statusCode = 400;
        customError.maxCount = error.maxCount;
        return customError;
    }

    return error;
};

/**
 * JSON 파싱 에러를 사용자 친화적인 에러로 변환
 * @param error 원본 에러
 * @returns 변환된 에러
 */
export const handleJsonError = (error: Error): CustomError => {
    if (error.message.includes('JSON') || error.name === 'SyntaxError') {
        const customError = new Error('잘못된 JSON 형식입니다. 데이터를 확인해주세요.') as CustomError;
        customError.statusCode = 400;
        customError.details = error.message;
        return customError;
    }
    return error as CustomError;
};

/**
 * 일반적인 에러를 처리하고 사용자 친화적인 메시지로 변환
 * @param error 원본 에러
 * @param options 옵션
 * @returns 변환된 에러
 */
export const handleError = (error: Error | CustomError, options: ErrorOptions = {}): CustomError => {
    const { resourceName = "데이터", fileType = "파일", defaultMessage } = options;
    const err = error as CustomError;

    // MongoDB 에러 처리
    if (err.name === 'CastError' || err.name === 'ValidationError' || 
        err.code === 11000 || err.name === 'MongoServerError' || 
        err.name === 'MongoNetworkError') {
        return handleMongoError(err, resourceName);
    }

    // 파일 시스템 에러 처리
    if (err.code === 'ENOENT' || err.code === 'EACCES' || err.code === 'EPERM' ||
        err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT') {
        return handleFileError(err, fileType);
    }

    // JSON 파싱 에러 처리
    if (err.message.includes('JSON') || err.name === 'SyntaxError') {
        return handleJsonError(err);
    }

    // 이미 사용자 정의 에러인 경우 그대로 반환
    if (err.statusCode && err.message) {
        return err;
    }

    // 기본 에러 메시지 설정
    if (defaultMessage && !err.message) {
        err.message = defaultMessage;
    }

    return err;
};

