/**
 * 환경 변수 타입 정의
 */

declare namespace NodeJS {
    interface ProcessEnv {
        // 데이터베이스
        DB_CONNECT: string;

        // CORS
        CORS_ORIGIN: string;

        // JWT
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
        /** 비밀번호 재설정(비로그인) 토큰 서명용. 미설정 시 JWT_ACCESS_SECRET 사용 */
        JWT_PASSWORD_RESET_SECRET?: string;

        // 서버 설정
        SERVER_URL?: string;
        SERVER_ADDRESS?: string;
        FRONTEND_URL?: string;
        PORT?: string;
        /** 리슨 호스트 (기본 0.0.0.0) */
        BIND_HOST?: string;
        /** true/1 | false/0 | 미설정 시 HTTPS 기동 여부 반영 */
        COOKIE_SECURE?: string;
        /** lax | strict | none */
        COOKIE_SAMESITE?: string;
        /** Helmet CSP 끄기: off | 0 | false */
        HELMET_CSP?: string;
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

        // 쿠키 도메인 (JWT 완전 전환 후에는 보통 불필요)
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

        // 파일 저장소 (로컬 public/Image vs S3 호환 객체 스토리지)
        /** local(기본) | s3 */
        STORAGE_DRIVER?: string;
        STORAGE_BUCKET?: string;
        STORAGE_ACCESS_KEY_ID?: string;
        STORAGE_SECRET_ACCESS_KEY?: string;
        /** 퍼블릭 URL 베이스 (끝 슬래시 없음) */
        STORAGE_PUBLIC_BASE_URL?: string;
        /** R2/MinIO 등 커스텀 엔드포인트 */
        STORAGE_ENDPOINT?: string;
        STORAGE_REGION?: string;
        /** path-style (R2/MinIO 권장: true) */
        STORAGE_S3_FORCE_PATH_STYLE?: string;
    }
}
