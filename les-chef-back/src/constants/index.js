/**
 * 상수 통합 export
 * 모든 상수를 한 곳에서 import할 수 있도록 제공
 */

const { SESSION_TTL_SECONDS, SESSION_MAX_AGE_MS } = require('./session');
const { RATE_LIMIT } = require('./rateLimit');
const { CACHE_TTL } = require('./cache');
const { MAX_INGREDIENT_ITEMS, MAIN_INGREDIENTS, KAMIS_DEFAULT_PARAMS } = require('./kamis');

module.exports = {
  // 세션
  SESSION_TTL_SECONDS,
  SESSION_MAX_AGE_MS,
  // 레이트 리밋
  RATE_LIMIT,
  // 캐시
  CACHE_TTL,
  // KAMIS
  MAX_INGREDIENT_ITEMS,
  MAIN_INGREDIENTS,
  KAMIS_DEFAULT_PARAMS,
};

