/**
 * 상수 통합 export
 * 모든 상수를 한 곳에서 import할 수 있도록 제공
 */

// System constants
export { SESSION_TTL_SECONDS, SESSION_MAX_AGE_MS } from './system/session';
export { RATE_LIMIT } from './system/rateLimit';
export { CACHE_TTL } from './system/cache';

// KAMIS constants
export { MAX_INGREDIENT_ITEMS, MAIN_INGREDIENTS, KAMIS_DEFAULT_PARAMS, PRICE_DIRECTION, type PriceDirection } from './kamis/kamis';

// Recipe constants
export { 
    RECIPE_SORT_OPTIONS, 
    RECIPE_SORT_LABELS, 
    POPULARITY_WEIGHTS, 
    DEFAULT_SORT_OPTION,
    type RecipeSortOption 
} from './recipe/recipe';

// Image constants
export {
    THUMBNAIL_SIZES,
    IMAGE_OPTIMIZATION,
    THUMBNAIL_DIR,
    MAX_IMAGE_DIMENSIONS,
} from './image/image';

// Error messages
export {
    COMMON_ERROR_MESSAGES,
    RESOURCE_ERROR_MESSAGES,
    FIELD_NAMES,
    HTTP_STATUS_MESSAGES,
    getFieldName,
    getUserFriendlyMessage,
} from './error/errorMessages';

// Foods constants
export {
    EXPIRY_ALERT_DAYS,
    FOOD_STATUS_LABELS,
    getDaysUntilExpiry,
    getFoodStatus,
    type FoodStatus,
} from './foods/foods';

