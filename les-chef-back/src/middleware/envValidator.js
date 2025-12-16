/**
 * 환경 변수 검증 미들웨어
 * 서버 시작 시 필수 환경 변수가 설정되어 있는지 확인
 */

require("dotenv").config();

const requiredEnvVars = [
    'DB_CONNECT',
    'SESSION_SECRET_KEY',
    'CORS_ORIGIN',
    'SSL_KEY_PATH',
    'SSL_CERT_PATH'
];

const validateEnvVars = () => {
    const missing = [];
    
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });
    
    if (missing.length > 0) {
        console.error('❌ 필수 환경 변수가 설정되지 않았습니다:');
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        process.exit(1);
    }
    
    // SESSION_SECRET_KEY 강도 검증
    if (process.env.SESSION_SECRET_KEY && process.env.SESSION_SECRET_KEY.length < 32) {
        console.warn('⚠️  SESSION_SECRET_KEY는 최소 32자 이상이어야 합니다.');
    }
    
    // CORS_ORIGIN 형식 검증
    if (process.env.CORS_ORIGIN) {
        const origins = process.env.CORS_ORIGIN.split(',');
        origins.forEach(origin => {
            if (!origin.trim().startsWith('http://') && !origin.trim().startsWith('https://')) {
                console.warn(`⚠️  CORS_ORIGIN 형식이 올바르지 않습니다: ${origin}`);
            }
        });
    }
    
    console.log('✅ 환경 변수 검증 완료');
};

module.exports = validateEnvVars;

