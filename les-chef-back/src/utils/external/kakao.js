/**
 * 카카오 API 호출 공통 헬퍼
 * 상태 코드 검사 및 에러 처리를 통일
 */

const isDev = process.env.NODE_ENV !== 'production';

/**
 * 카카오 API 호출 헬퍼
 * @param {string} url - API URL
 * @param {RequestInit} options - fetch 옵션
 * @returns {Promise<Response>} - fetch 응답
 * @throws {Error} - API 호출 실패 시 에러
 */
async function fetchKakaoAPI(url, options = {}) {
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
        if (isDev) {
            console.error('카카오 API 호출 오류:', error);
        }
        throw error;
    }
}

/**
 * 카카오 OAuth 토큰 요청
 * @param {string} code - 인증 코드
 * @returns {Promise<Object>} - 토큰 응답 데이터
 */
async function getKakaoToken(code) {
    const KAKAO_AUTH_URL = process.env.KAKAO_AUTH_URL || 'https://kauth.kakao.com';
    const response = await fetchKakaoAPI(`${KAKAO_AUTH_URL}/oauth/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_API_KEY,
            redirect_uri: `${process.env.SERVER_ADDRESS}/customer/kakaoLogin`,
            code: code,
        }),
    });

    return await response.json();
}

/**
 * 카카오 사용자 연동 해제
 * @param {string} userId - 카카오 사용자 ID (kakao_123456 형식)
 * @returns {Promise<void>}
 */
async function unlinkKakaoUser(userId) {
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
            target_id: kakaoUserId,
        }),
    });
}

module.exports = {
    fetchKakaoAPI,
    getKakaoToken,
    unlinkKakaoUser,
};

