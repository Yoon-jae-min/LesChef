/**
 * 에러 메시지 상수
 * 사용자 친화적인 에러 메시지 정의
 */

// 공통 에러 메시지
export const COMMON_ERROR_MESSAGES = {
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    NETWORK_ERROR: '네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.',
    DATABASE_ERROR: '데이터베이스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    VALIDATION_ERROR: '입력한 정보를 확인해주세요.',
    INVALID_REQUEST: '잘못된 요청입니다.',
    TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
} as const;

// 리소스별 에러 메시지
export const RESOURCE_ERROR_MESSAGES = {
    RECIPE: {
        NOT_FOUND: '레시피를 찾을 수 없습니다.',
        CREATE_FAILED: '레시피 등록에 실패했습니다.',
        UPDATE_FAILED: '레시피 수정에 실패했습니다.',
        DELETE_FAILED: '레시피 삭제에 실패했습니다.',
        DUPLICATE_NAME: '이미 같은 이름의 레시피가 있습니다.',
        INVALID_CATEGORY: '올바른 카테고리를 선택해주세요.',
        MISSING_IMAGE: '레시피 이미지가 필요합니다.',
        MISSING_INGREDIENTS: '재료 정보가 필요합니다.',
        MISSING_STEPS: '조리 단계가 필요합니다.',
    },
    USER: {
        NOT_FOUND: '사용자를 찾을 수 없습니다.',
        DUPLICATE_ID: '이미 사용 중인 아이디입니다.',
        DUPLICATE_EMAIL: '이미 사용 중인 이메일입니다.',
        INVALID_CREDENTIALS: '아이디 또는 비밀번호가 올바르지 않습니다.',
        PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
        WEAK_PASSWORD: '비밀번호는 8자 이상이어야 합니다.',
    },
    BOARD: {
        NOT_FOUND: '게시글을 찾을 수 없습니다.',
        CREATE_FAILED: '게시글 작성에 실패했습니다.',
        UPDATE_FAILED: '게시글 수정에 실패했습니다.',
        DELETE_FAILED: '게시글 삭제에 실패했습니다.',
        UNAUTHORIZED: '게시글을 수정하거나 삭제할 권한이 없습니다.',
    },
    FILE: {
        NOT_FOUND: '파일을 찾을 수 없습니다.',
        UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
        TOO_LARGE: '파일 크기가 너무 큽니다. (최대 10MB)',
        TOO_MANY: '파일 개수가 너무 많습니다.',
        INVALID_TYPE: '지원하지 않는 파일 형식입니다.',
        INVALID_FORMAT: '파일 형식이 올바르지 않습니다.',
    },
    FOODS: {
        NOT_FOUND: '식재료 정보를 찾을 수 없습니다.',
        PLACE_NOT_FOUND: '보관 장소를 찾을 수 없습니다.',
        FOOD_NOT_FOUND: '식재료를 찾을 수 없습니다.',
        DUPLICATE_PLACE: '이미 존재하는 보관 장소 이름입니다.',
        CREATE_FAILED: '식재료 등록에 실패했습니다.',
        UPDATE_FAILED: '식재료 수정에 실패했습니다.',
        DELETE_FAILED: '식재료 삭제에 실패했습니다.',
        INVALID_PLACE_NAME: '보관 장소 이름을 입력해주세요.',
        INVALID_PLACE_NAME_REQUIRED: '유효한 보관 장소 이름이 필요합니다.',
        INVALID_FOOD_NAME: '식재료 이름을 입력해주세요.',
        INVALID_EXPIRY_DATE: '유통기한을 입력해주세요.',
        PLACE_NAME_REQUIRED: '보관 장소 이름이 필요합니다.',
        PLACE_NAMES_REQUIRED: '기존 이름과 변경할 이름이 필요합니다.',
        PLACE_AND_FOOD_NAME_REQUIRED: '보관 장소 이름과 식재료 이름은 필수입니다.',
        PLACE_FOOD_ID_NAME_REQUIRED: '보관 장소 이름, 식재료 ID, 식재료 이름은 필수입니다.',
    },
} as const;

// 필드명 한글 매핑
export const FIELD_NAMES: Record<string, string> = {
    // 사용자 필드
    id: '아이디',
    pwd: '비밀번호',
    name: '이름',
    nickName: '닉네임',
    tel: '전화번호',
    email: '이메일',

    // 레시피 필드
    recipeName: '레시피 이름',
    cookTime: '조리 시간',
    portion: '분량',
    portionUnit: '분량 단위',
    cookLevel: '난이도',
    majorCategory: '카테고리',
    subCategory: '세부 카테고리',
    recipeImg: '레시피 이미지',
    viewCount: '조회수',
    userId: '사용자 ID',
    userNickName: '작성자',
    isShare: '공유 여부',
    tags: '태그',
    averageRating: '평균 평점',
    reviewCount: '리뷰 수',

    // 게시글 필드
    title: '제목',
    content: '내용',
    boardId: '게시글 ID',

    // 공통 필드
    _id: 'ID',
    createdAt: '생성일',
    updatedAt: '수정일',
} as const;

// HTTP 상태 코드별 기본 메시지
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
    400: '잘못된 요청입니다.',
    401: '인증이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 정보를 찾을 수 없습니다.',
    409: '이미 존재하는 정보입니다.',
    413: '요청 크기가 너무 큽니다.',
    422: '처리할 수 없는 요청입니다.',
    429: '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
    500: '서버 오류가 발생했습니다.',
    503: '서비스를 일시적으로 사용할 수 없습니다.',
} as const;

/**
 * 필드명을 한글로 변환
 */
export function getFieldName(field: string): string {
    return FIELD_NAMES[field] || field;
}

/**
 * 에러 타입별 사용자 친화적 메시지 생성
 */
export function getUserFriendlyMessage(
    errorType: string,
    resourceName?: string,
    field?: string
): string {
    const fieldName = field ? getFieldName(field) : '';

    switch (errorType) {
        case 'ValidationError':
            return fieldName
                ? `${fieldName}을(를) 확인해주세요.`
                : COMMON_ERROR_MESSAGES.VALIDATION_ERROR;

        case 'CastError':
            return fieldName ? `잘못된 ${fieldName} 형식입니다.` : '잘못된 데이터 형식입니다.';

        case 'DuplicateKey':
            return fieldName
                ? `이미 사용 중인 ${fieldName}입니다.`
                : COMMON_ERROR_MESSAGES.VALIDATION_ERROR;

        case 'NotFound':
            return resourceName
                ? `${resourceName}을(를) 찾을 수 없습니다.`
                : COMMON_ERROR_MESSAGES.NOT_FOUND;

        case 'Unauthorized':
            return COMMON_ERROR_MESSAGES.UNAUTHORIZED;

        case 'Forbidden':
            return COMMON_ERROR_MESSAGES.FORBIDDEN;

        case 'FileError':
            return resourceName || COMMON_ERROR_MESSAGES.SERVER_ERROR;

        default:
            return COMMON_ERROR_MESSAGES.SERVER_ERROR;
    }
}
