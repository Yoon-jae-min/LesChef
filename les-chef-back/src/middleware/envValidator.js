/**
 * 환경 변수 검증 미들웨어
 * 서버 시작 시 필수 환경 변수가 설정되어 있는지 확인
 */

require("dotenv").config();
const isDev = process.env.NODE_ENV !== 'production';
const logger = require("../utils/logger");

const requiredEnvVars = [
    'DB_CONNECT',
    'SESSION_SECRET_KEY',
    'CORS_ORIGIN',
    'SSL_KEY_PATH',
    'SSL_CERT_PATH',
];

// 서비스 품질을 위해 설정을 권장하는 환경 변수 (없어도 실행 가능)
const recommendedEnvVars = [
    'SERVER_URL',
    'SERVER_ADDRESS',
    'KAMIS_API_BASE_URL',
    'KAMIS_CERT_KEY',
    'KAMIS_CERT_ID',
    'KAKAO_API_KEY',
    'KAKAO_APP_ADMIN_KEY',
    'KAKAO_AUTH_URL',
    'KAKAO_API_URL',
];

const validateEnvVars = () => {
    const missing = [];
    
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });
    
    if (missing.length > 0) {
        logger.error('❌ 필수 환경 변수가 설정되지 않았습니다:', { missing });
        process.exit(1);
    }
    
    // SESSION_SECRET_KEY 강도 검증
    if (process.env.SESSION_SECRET_KEY && process.env.SESSION_SECRET_KEY.length < 32) {
        if (isDev) {
            logger.warn('⚠️  SESSION_SECRET_KEY는 최소 32자 이상이어야 합니다.');
        }
    }
    
    // CORS_ORIGIN 형식 검증
    if (process.env.CORS_ORIGIN) {
        const origins = process.env.CORS_ORIGIN.split(',');
        origins.forEach(origin => {
            if (!origin.trim().startsWith('http://') && !origin.trim().startsWith('https://')) {
                if (isDev) {
                    logger.warn(`⚠️  CORS_ORIGIN 형식이 올바르지 않습니다: ${origin}`);
                }
            }
        });
    }

    // 권장 환경 변수 안내 (개발/테스트는 동작 가능)
    const missingRecommended = recommendedEnvVars.filter(varName => !process.env[varName]);
    if (missingRecommended.length > 0 && isDev) {
        logger.warn('ℹ️  설정을 권장하는 환경 변수가 누락되었습니다 (개발/테스트는 동작 가능):', { missingRecommended });
    }
    
    if (isDev) {
        logger.info('✅ 환경 변수 검증 완료');
    }
};

module.exports = validateEnvVars;

