# 유지보수 이슈 분석 리포트

## 🚨 주요 유지보수 방해 요소

### 1. 중복된 로그인 체크 로직 ⚠️

**문제:**
여러 컴포넌트에서 동일한 로그인 체크 로직을 반복 사용:

```tsx
// ❌ 중복된 패턴 (9곳에서 반복)
const loggedIn = typeof window !== "undefined" && 
                 localStorage.getItem("leschef_is_logged_in") === "true";
```

**영향 파일:**
- `RecipeDetailClient.tsx`
- `RecipeCard.tsx`
- `top.tsx`
- `recipe/[category]/layout.tsx`
- `ClientMyPageLayout.tsx`

**문제점:**
- ❌ 로직 변경 시 여러 파일 수정 필요
- ❌ 실수 가능성 (문자열 오타 등)
- ❌ 유지보수 어려움

**해결 방법:**
```tsx
// ✅ 유틸리티 함수로 통합
// utils/authUtils.ts
export const checkLoginStatus = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("leschef_is_logged_in") === "true";
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("leschef_current_user");
  return userStr ? JSON.parse(userStr) : null;
};
```

---

### 2. 중복된 Storage 키 상수 ⚠️

**문제:**
Storage 키가 문자열로 하드코딩되어 여러 곳에서 사용:

```tsx
// ❌ 하드코딩된 키 (여러 곳에서 반복)
localStorage.getItem("leschef_is_logged_in")
localStorage.getItem("leschef_current_user")
sessionStorage.getItem("leschef_return_to")
sessionStorage.getItem("leschef_from_source")
```

**문제점:**
- ❌ 키 변경 시 여러 파일 수정 필요
- ❌ 오타 가능성
- ❌ 중앙 관리 불가

**해결 방법:**
```tsx
// ✅ 상수로 정의
// constants/storageKeys.ts
export const STORAGE_KEYS = {
  IS_LOGGED_IN: "leschef_is_logged_in",
  CURRENT_USER: "leschef_current_user",
  RETURN_TO: "leschef_return_to",
  FROM_SOURCE: "leschef_from_source",
} as const;

// 사용
localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN)
```

---

### 3. API URL 하드코딩 및 중복 정의 ⚠️

**문제:**
여러 파일에서 API URL이 하드코딩되어 있음:

```tsx
// ❌ 여러 파일에서 하드코딩
// utils/authApi.ts
const API_BASE_URL = "http://localhost:3000/api/customer";

// utils/boardApi.ts
const API_BASE_URL = "http://localhost:3000/api/board";

// utils/recipeApi.ts
const API_BASE_URL = "http://localhost:3000/api/recipe";

// utils/ingredientPriceApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:443";

// utils/serverApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:443";
const RECIPE_API_BASE_URL = process.env.NEXT_PUBLIC_RECIPE_API_URL || "http://localhost:3000/api/recipe";
const BOARD_API_BASE_URL = process.env.NEXT_PUBLIC_BOARD_API_URL || "http://localhost:3000/api/board";
```

**문제점:**
- ❌ 환경별 URL 변경 시 여러 파일 수정 필요
- ❌ 일관성 없는 패턴 (일부는 env 변수, 일부는 하드코딩)
- ❌ 실수 가능성 (URL 오타, 포트 변경 누락)

**해결 방법:**
```tsx
// ✅ 중앙 관리
// config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:443",
  RECIPE_API: process.env.NEXT_PUBLIC_RECIPE_API_URL || "http://localhost:3000/api/recipe",
  BOARD_API: process.env.NEXT_PUBLIC_BOARD_API_URL || "http://localhost:3000/api/board",
  CUSTOMER_API: process.env.NEXT_PUBLIC_CUSTOMER_API_URL || "http://localhost:3000/api/customer",
} as const;
```

---

### 4. 카테고리 매핑 중복 ⚠️

**문제:**
카테고리 매핑이 여러 파일에 중복 정의:

```tsx
// ❌ 중복된 정의
// app/recipe/[category]/page.tsx
const CATEGORY_TO_API: Record<string, string> = {
  korean: "korean",
  japanese: "japanese",
  // ...
};

// components/recipe/RecipeListClient.tsx
const CATEGORY_TO_API: Record<string, string> = {
  korean: "korean",
  japanese: "japanese",
  // ...
};
```

**문제점:**
- ❌ 카테고리 추가/변경 시 여러 파일 수정 필요
- ❌ 일관성 유지 어려움
- ❌ 실수 가능성 (매핑 불일치)

**해결 방법:**
```tsx
// ✅ 공통 상수 파일
// constants/categories.ts
export const CATEGORY_TO_API: Record<string, string> = {
  korean: "korean",
  japanese: "japanese",
  chinese: "chinese",
  western: "western",
  other: "other",
  etc: "other",
} as const;

export const CATEGORY_LABEL: Record<string, string> = {
  notice: "공지",
  free: "자유",
} as const;
```

---

### 5. TODO 주석 (미완성 기능) ⚠️

**문제:**
여러 곳에 TODO 주석이 있어 미완성 기능 표시:

```tsx
// TODO: 기존 게시글 데이터 로드 로직 추가 필요 (board/edit/page.tsx)
// TODO: API에서 삭제 후 mutate() 호출 (BoardDetailClient.tsx)
// TODO: subCategory, sort, page 등은 추후 연동 (RecipeListClient.tsx)
// TODO: API 연동 - 비밀번호 확인 엔드포인트 연결 (myPage/info/page.tsx)
// TODO: API 연동 - 실제 서버로 탈퇴 요청 (myPage/info/page.tsx)
// TODO: API 연동 (find-id/page.tsx)
// TODO: API 연동 (find-password/page.tsx)
```

**문제점:**
- ❌ 미완성 기능 존재
- ❌ 기능 동작 불명확
- ❌ 향후 작업 필요

**해결 방법:**
- 기능 우선순위 정하고 구현 계획 수립
- 또는 제거하고 이슈 트래커에 등록

---

### 6. 일관성 없는 에러 처리 패턴 ⚠️

**문제:**
에러 처리가 일관성 없음:

```tsx
// ❌ 다양한 패턴
console.error(err);  // 일부는 console
alert("에러 메시지");  // 일부는 alert
throw new Error("에러");  // 일부는 throw
```

**문제점:**
- ❌ 사용자 경험 불일치
- ❌ 디버깅 어려움
- ❌ 에러 추적 어려움

**해결 방법:**
```tsx
// ✅ 통일된 에러 처리
// utils/errorHandler.ts
export const handleError = (error: unknown, userMessage?: string) => {
  console.error(error);
  // 개발 환경에서는 상세 로그
  // 프로덕션에서는 사용자 친화적 메시지
  alert(userMessage || "오류가 발생했습니다.");
};
```

---

### 7. 매직 넘버/문자열 ⚠️

**문제:**
하드코딩된 숫자/문자열이 여러 곳에 존재:

```tsx
// ❌ 매직 넘버
dedupingInterval: 300000,  // 5분 = 300000ms
dedupingInterval: 600000,  // 10분 = 600000ms
dedupingInterval: 3600000, // 1시간 = 3600000ms

// ❌ 매직 문자열
"korean", "japanese", "공지", "자유"
```

**문제점:**
- ❌ 의미 불명확 (300000이 무엇인지?)
- ❌ 변경 시 여러 곳 수정 필요
- ❌ 일관성 유지 어려움

**해결 방법:**
```tsx
// ✅ 상수로 정의
// constants/timing.ts
export const TIMING = {
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
} as const;

// constants/categories.ts (위에서 정의)
```

---

### 8. 복잡한 조건문 ⚠️

**문제:**
복잡한 조건문이 여러 곳에 존재:

```tsx
// ❌ 복잡한 조건
isClient && !isLoading ? '/ingredient-price' : null
CATEGORY_TO_API[category] ? category : "korean"
```

**문제점:**
- ❌ 가독성 저하
- ❌ 로직 이해 어려움
- ❌ 테스트 어려움

**해결 방법:**
```tsx
// ✅ 명확한 함수로 분리
const getApiCategory = (category: string): string => {
  return CATEGORY_TO_API[category] || "korean";
};

const shouldFetchData = (isClient: boolean, isLoading: boolean): boolean => {
  return isClient && !isLoading;
};
```

---

## 📊 유지보수성 영향도

### 높음 (즉시 개선 권장)

1. **로그인 체크 로직 중복** - 9곳에서 반복
   - **영향**: 로그인 로직 변경 시 9개 파일 수정
   - **우선순위**: ⭐⭐⭐ (높음)

2. **Storage 키 상수화** - 22곳에서 사용
   - **영향**: 키 변경 시 22개 위치 수정
   - **우선순위**: ⭐⭐⭐ (높음)

3. **API URL 중복 정의** - 5개 파일
   - **영향**: 환경별 설정 시 5개 파일 수정
   - **우선순위**: ⭐⭐⭐ (높음)

### 중간 (점진적 개선)

4. **카테고리 매핑 중복** - 3곳
   - **영향**: 카테고리 추가 시 3개 파일 수정
   - **우선순위**: ⭐⭐ (중간)

5. **매직 넘버/문자열** - 여러 곳
   - **영향**: 값 변경 시 여러 곳 수정
   - **우선순위**: ⭐⭐ (중간)

### 낮음 (선택적 개선)

6. **TODO 주석** - 7곳
   - **영향**: 기능 완성도 문제
   - **우선순위**: ⭐ (낮음, 기능 구현 시)

7. **에러 처리 패턴** - 여러 곳
   - **영향**: 일관성 문제
   - **우선순위**: ⭐ (낮음)

---

## 🎯 개선 우선순위

### Phase 1: 즉시 개선 (유지보수성 크게 향상)

1. ✅ **로그인 체크 유틸리티 함수 생성**
   - `utils/authUtils.ts` 생성
   - 모든 로그인 체크 로직 통합

2. ✅ **Storage 키 상수 파일 생성**
   - `constants/storageKeys.ts` 생성
   - 모든 Storage 키 상수화

3. ✅ **API URL 중앙 관리**
   - `config/apiConfig.ts` 생성
   - 모든 API URL 통합 관리

### Phase 2: 점진적 개선 (코드 일관성 향상)

4. ✅ **카테고리 상수 파일 생성**
   - `constants/categories.ts` 생성
   - 카테고리 매핑 통합

5. ✅ **타이밍 상수 파일 생성**
   - `constants/timing.ts` 생성
   - 매직 넘버 상수화

### Phase 3: 선택적 개선 (코드 품질 향상)

6. ⚪ **에러 처리 유틸리티 함수 생성**
   - `utils/errorHandler.ts` 생성
   - 통일된 에러 처리 패턴

7. ⚪ **TODO 기능 구현**
   - 우선순위에 따라 기능 구현
   - 또는 이슈 트래커에 등록

---

## 📈 개선 효과 예상

### Before (현재)

| 항목 | 문제 |
|------|------|
| 로그인 체크 변경 | 9개 파일 수정 필요 |
| Storage 키 변경 | 22개 위치 수정 필요 |
| API URL 변경 | 5개 파일 수정 필요 |
| 카테고리 추가 | 3개 파일 수정 필요 |

### After (개선 후)

| 항목 | 개선 |
|------|------|
| 로그인 체크 변경 | 1개 파일만 수정 |
| Storage 키 변경 | 1개 파일만 수정 |
| API URL 변경 | 1개 파일만 수정 |
| 카테고리 추가 | 1개 파일만 수정 |

**개선 효과: 80-90% 유지보수 비용 감소**

---

## 🔧 권장 개선 작업 순서

1. **Phase 1** - 즉시 개선 (유지보수성 크게 향상)
2. **Phase 2** - 점진적 개선 (코드 일관성 향상)
3. **Phase 3** - 선택적 개선 (코드 품질 향상)

현재 상태도 동작은 하지만, 위 개선을 통해 유지보수 비용을 크게 줄일 수 있습니다.

