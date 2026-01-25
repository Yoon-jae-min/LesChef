/**
 * 카카오 API 호출 공통 헬퍼
 * 상태 코드 검사 및 에러 처리를 통일
 */

import logger from '../system/logger';

interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token?: string;
    expires_in: number;
    scope?: string;
    [key: string]: unknown;
}

/**
 * 카카오 API 호출 헬퍼
 * @param url - API URL
 * @param options - fetch 옵션
 * @returns fetch 응답
 * @throws API 호출 실패 시 에러
 */
export async function fetchKakaoAPI(url: string, options: RequestInit = {}): Promise<Response> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                ...options.headers,
            },
        });

        // 상태 코드 검사
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`카카오 API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response;
    } catch (error) {
        logger.error('카카오 API 호출 오류', { error });
        throw error;
    }
}

/**
 * 카카오 OAuth 토큰 요청
 * @param code - 인증 코드
 * @returns 토큰 응답 데이터
 */
export async function getKakaoToken(code: string): Promise<KakaoTokenResponse> {
    const KAKAO_AUTH_URL = process.env.KAKAO_AUTH_URL || 'https://kauth.kakao.com';
    const response = await fetchKakaoAPI(`${KAKAO_AUTH_URL}/oauth/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_API_KEY || '',
            redirect_uri: `${process.env.SERVER_ADDRESS}/customer/kakaoLogin`,
            code: code,
        }),
    });

    return await response.json() as KakaoTokenResponse;
}

/**
 * 카카오 사용자 연동 해제
 * @param userId - 카카오 사용자 ID (kakao_123456 형식)
 * @returns Promise<void>
 */
export async function unlinkKakaoUser(userId: string): Promise<void> {
    const KAKAO_API_URL = process.env.KAKAO_API_URL || 'https://kapi.kakao.com';
    const kakaoUserId = Number(userId.split('_')[1]);

    if (isNaN(kakaoUserId)) {
        throw new Error('유효하지 않은 카카오 사용자 ID 형식입니다.');
    }

    await fetchKakaoAPI(`${KAKAO_API_URL}/v1/user/unlink`, {
        method: 'POST',
        headers: {
            'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
        },
        body: new URLSearchParams({
            target_id_type: 'user_id',
            target_id: kakaoUserId.toString(),
        }),
    });
}

