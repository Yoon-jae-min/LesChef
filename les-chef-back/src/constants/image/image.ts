/**
 * 이미지 처리 관련 상수
 */

// 썸네일 크기 설정
export const THUMBNAIL_SIZES = {
    LIST: {
        width: 400,
        height: 240,
    },
    STEP: {
        width: 200,
        height: 200,
    },
} as const;

// 이미지 최적화 설정
export const IMAGE_OPTIMIZATION = {
    QUALITY: 85, // JPEG 품질 (0-100)
    WEBP_QUALITY: 85, // WebP 품질 (0-100)
    FORMAT: 'webp' as const, // 기본 포맷
    FORMATS: ['webp', 'jpeg', 'png'] as const,
} as const;

// 썸네일 디렉토리 이름
export const THUMBNAIL_DIR = 'thumbnails';

// 이미지 최대 크기 (원본 유지)
export const MAX_IMAGE_DIMENSIONS = {
    LIST: {
        width: 1920,
        height: 1080,
    },
    STEP: {
        width: 1200,
        height: 1200,
    },
} as const;
