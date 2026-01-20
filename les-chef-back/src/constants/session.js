/**
 * 세션/쿠키 관련 상수
 */

const SESSION_TTL_SECONDS = 3600; // 1시간 (세션 저장 TTL)
const SESSION_MAX_AGE_MS = 1000 * 60 * 60; // 1시간 (쿠키 만료)

module.exports = {
  SESSION_TTL_SECONDS,
  SESSION_MAX_AGE_MS,
};

