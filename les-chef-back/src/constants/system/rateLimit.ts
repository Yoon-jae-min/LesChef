/**
 * 레이트 리밋 설정 상수
 */

export const RATE_LIMIT = {
    API: {
        WINDOW_MS: 15 * 60 * 1000, // 15분
        MAX: 100,
        MESSAGE: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    },
    AUTH: {
        WINDOW_MS: 15 * 60 * 1000, // 15분
        MAX: 5,
        MESSAGE: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
    },
    UPLOAD: {
        WINDOW_MS: 60 * 60 * 1000, // 1시간
        MAX: 20,
        MESSAGE: '파일 업로드 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.',
    },
} as const;
