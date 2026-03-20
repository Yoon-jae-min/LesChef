/**
 * 구글 OAuth API 호출 헬퍼
 */

import logger from '../system/logger';

interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token?: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

/**
 * 구글 OAuth 토큰 요청
 * @param code - 인증 코드
 * @returns 토큰 응답 데이터
 */
export async function getGoogleToken(code: string): Promise<GoogleTokenResponse> {
    const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

    try {
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: `${process.env.SERVER_ADDRESS}/customer/googleLogin`,
                grant_type: 'authorization_code',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(
                `구글 API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`
            );
        }

        return (await response.json()) as GoogleTokenResponse;
    } catch (error) {
        logger.error('구글 토큰 요청 오류', { error });
        throw error;
    }
}

/**
 * 구글 사용자 정보 가져오기
 * @param accessToken - 구글 액세스 토큰
 * @returns 사용자 정보 (이메일 포함)
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

    try {
        const response = await fetch(GOOGLE_USERINFO_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(
                `구글 API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`
            );
        }

        return (await response.json()) as GoogleUserInfo;
    } catch (error) {
        logger.error('구글 사용자 정보 API 호출 오류', { error });
        throw error;
    }
}
