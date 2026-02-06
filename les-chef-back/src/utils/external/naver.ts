/**
 * 네이버 OAuth API 호출 헬퍼
 */

import logger from '../system/logger';

interface NaverTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    error?: string;
    error_description?: string;
}

interface NaverUserInfo {
    resultcode: string;
    message: string;
    response?: {
        id: string;
        email?: string;
        name?: string;
        nickname?: string;
        profile_image?: string;
        age?: string;
        gender?: string;
        mobile?: string;
        mobile_e164?: string;
    };
}

/**
 * 네이버 OAuth 토큰 요청
 * @param code - 인증 코드
 * @param state - 상태 값 (CSRF 방지용)
 * @returns 토큰 응답 데이터
 */
export async function getNaverToken(code: string, state: string): Promise<NaverTokenResponse> {
    const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
    
    try {
        const response = await fetch(NAVER_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID || '',
                client_secret: process.env.NAVER_CLIENT_SECRET || '',
                code: code,
                state: state,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`네이버 API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json() as NaverTokenResponse;
        
        if (data.error) {
            throw new Error(`네이버 토큰 요청 실패: ${data.error} - ${data.error_description || ''}`);
        }

        return data;
    } catch (error) {
        logger.error('네이버 토큰 요청 오류', { error });
        throw error;
    }
}

/**
 * 네이버 사용자 정보 가져오기
 * @param accessToken - 네이버 액세스 토큰
 * @returns 사용자 정보 (이메일 포함)
 */
export async function getNaverUserInfo(accessToken: string): Promise<NaverUserInfo> {
    const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';
    
    try {
        const response = await fetch(NAVER_USERINFO_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`네이버 API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json() as NaverUserInfo;
    } catch (error) {
        logger.error('네이버 사용자 정보 API 호출 오류', { error });
        throw error;
    }
}

