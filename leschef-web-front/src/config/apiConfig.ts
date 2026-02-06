/**
 * API 설정
 * 모든 API URL을 중앙에서 관리
 * 
 * [개발 환경]
 * - 현재: HTTP (http://localhost:3001)
 * - 프로덕션 복구 시: HTTPS (https://localhost:443)로 변경 필요
 */
const BASE_URL = "http://localhost:3001";

export const API_CONFIG = {
  BASE_URL,
  RECIPE_API: `${BASE_URL}/recipe`,
  BOARD_API: `${BASE_URL}/board`,
  CUSTOMER_API: `${BASE_URL}/customer`,
  FOODS_API: `${BASE_URL}/foods`,
} as const;

/**
 * 카카오 OAuth 설정
 * TODO: 환경 변수로 이동 필요 (process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY)
 */
export const KAKAO_CONFIG = {
  // 카카오 REST API 키 (카카오 개발자 콘솔에서 발급)
  // 환경 변수로 관리하는 것을 권장: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || ''
  REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || '',
  // 카카오 인증 URL
  AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  // 리다이렉트 URI (백엔드 엔드포인트)
  REDIRECT_URI: `${BASE_URL}/customer/kakaoLogin`,
} as const;

/**
 * 카카오 로그인 URL 생성
 * @returns 카카오 OAuth 인증 URL
 */
export const getKakaoLoginUrl = (): string => {
  if (!KAKAO_CONFIG.REST_API_KEY) {
    throw new Error('카카오 REST API 키가 설정되지 않았습니다.');
  }
  
  const params = new URLSearchParams({
    client_id: KAKAO_CONFIG.REST_API_KEY,
    redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
    response_type: 'code',
  });
  
  return `${KAKAO_CONFIG.AUTH_URL}?${params.toString()}`;
};

/**
 * 구글 OAuth 설정
 */
export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  REDIRECT_URI: `${API_CONFIG.BASE_URL}/customer/googleLogin`,
  SCOPE: 'openid email profile',
} as const;

/**
 * 구글 로그인 URL 생성
 * @returns 구글 OAuth 인증 URL
 */
export const getGoogleLoginUrl = (): string => {
  if (!GOOGLE_CONFIG.CLIENT_ID) {
    throw new Error('구글 클라이언트 ID가 설정되지 않았습니다.');
  }
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
    response_type: 'code',
    scope: GOOGLE_CONFIG.SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });
  
  return `${GOOGLE_CONFIG.AUTH_URL}?${params.toString()}`;
};

/**
 * 네이버 OAuth 설정
 */
export const NAVER_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '',
  AUTH_URL: 'https://nid.naver.com/oauth2.0/authorize',
  REDIRECT_URI: `${API_CONFIG.BASE_URL}/customer/naverLogin`,
  STATE: 'leschef_naver_login', // CSRF 방지용 (실제로는 랜덤 값 권장)
} as const;

/**
 * 네이버 로그인 URL 생성
 * @returns 네이버 OAuth 인증 URL
 */
export const getNaverLoginUrl = (): string => {
  if (!NAVER_CONFIG.CLIENT_ID) {
    throw new Error('네이버 클라이언트 ID가 설정되지 않았습니다.');
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: NAVER_CONFIG.CLIENT_ID,
    redirect_uri: NAVER_CONFIG.REDIRECT_URI,
    state: NAVER_CONFIG.STATE,
  });
  
  return `${NAVER_CONFIG.AUTH_URL}?${params.toString()}`;
};

