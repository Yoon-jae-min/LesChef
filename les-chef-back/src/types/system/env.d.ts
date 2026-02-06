/**
 * 환경 변수 타입 정의
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // 데이터베이스
    DB_CONNECT: string;
    
    // 세션
    SESSION_SECRET_KEY: string;
    
    // CORS
    CORS_ORIGIN: string;
    
    // 서버 설정
    SERVER_URL?: string;
    SERVER_ADDRESS?: string;
    FRONTEND_URL?: string;
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    
    // SSL 인증서 (프로덕션 필수, 개발 선택)
    SSL_KEY_PATH?: string;
    SSL_CERT_PATH?: string;
    
    // KAMIS API (식재료 물가 정보)
    KAMIS_API_BASE_URL?: string;
    KAMIS_CERT_KEY?: string;
    KAMIS_CERT_ID?: string;
    
    // 카카오 소셜 로그인
    KAKAO_API_KEY?: string;
    KAKAO_APP_ADMIN_KEY?: string;
    KAKAO_AUTH_URL?: string;
    KAKAO_API_URL?: string;
    
    // 구글 소셜 로그인
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    
    // 네이버 소셜 로그인
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    
    // 쿠키 도메인
    COOKIE_DOMAIN?: string;
    
    // 이메일 발송 설정
    EMAIL_SERVICE?: string; // 'gmail' 또는 'smtp'
    EMAIL_USER?: string; // 발신자 이메일
    EMAIL_APP_PASSWORD?: string; // Gmail 앱 비밀번호
    EMAIL_FROM?: string; // 발신자 표시 이름
    SMTP_HOST?: string; // 커스텀 SMTP 호스트
    SMTP_PORT?: string; // 커스텀 SMTP 포트
    SMTP_SECURE?: string; // 'true' 또는 'false'
    SMTP_USER?: string; // SMTP 사용자명
    SMTP_PASSWORD?: string; // SMTP 비밀번호
  }
}

