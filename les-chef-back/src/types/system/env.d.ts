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
    
    // 쿠키 도메인
    COOKIE_DOMAIN?: string;
  }
}

