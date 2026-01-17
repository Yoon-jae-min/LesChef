# 코드 정리 체크리스트

## 🔍 발견된 문제점

### 1. 중복 PostCSS 설정 파일 ⚠️

**문제:**
- `postcss.config.jsx`와 `postcss.config.mjs` 두 파일이 존재
- 둘 중 하나만 필요

**위치:**
- `postcss.config.jsx`
- `postcss.config.mjs`

**영향도:** 낮음 (중복 파일)

**제안:**
- 하나만 유지 (일반적으로 `.mjs` 또는 `.js` 사용)
- 불필요한 파일 제거

---

### 2. 타입 안전성 문제 ⚠️

**문제:**
`as any`, `as unknown` 사용으로 타입 안전성 저하

**발견된 위치:**

1. **`app/recipe/[category]/page.tsx:26`**
   ```tsx
   category: apiCategory as any,
   ```
   **제안:** `apiCategory`의 타입을 명확히 정의

2. **`components/board/BoardListClient.tsx:91`**
   ```tsx
   onClick={(e) => handleEditClick(e, post._id as unknown as number)}
   ```
   **제안:** `post._id` 타입 확인 후 적절한 타입으로 수정

3. **`utils/recipeApi.ts`** - 여러 곳에서 `any[]` 사용
   ```tsx
   list: any[];
   wishList: any[];
   ```
   **제안:** 적절한 타입 정의

4. **`utils/authUtils.ts:21`**
   ```tsx
   { id?: string; [key: string]: any }
   ```
   **제안:** 사용자 타입 인터페이스 정의

**영향도:** 중간 (타입 안전성 저하, 런타임 에러 가능성)

---

### 3. 사용되지 않는 swrFetcher.ts ⚠️

**문제:**
- `utils/swrFetcher.ts` 파일이 생성되었지만 사용되지 않음
- SWRProvider에서 주석 처리되어 있음

**위치:**
- `src/utils/swrFetcher.ts`

**확인 필요:**
- 실제로 사용되지 않는지 확인
- 사용 계획이 있다면 유지, 없다면 제거

**영향도:** 낮음 (사용되지 않는 파일)

---

### 4. Console.log 디버그 코드 ⚠️

**문제:**
프로덕션 코드에 `console.log`, `console.error` 등 남아있음

**발견된 위치:**
- 22곳에서 사용 (17개 파일)

**영향도:** 낮음 (성능 영향 작음, 로그 노출 가능)

**제안:**
- 개발 환경에서만 출력되도록 수정
- 또는 `errorHandler.ts`의 `logError` 사용

---

### 5. MD 문서 파일 (유지 권장) ✅

**문서 파일들:**
- `PERFORMANCE_AUDIT.md` - 성능 최적화 리포트
- `MAINTENANCE_ISSUES.md` - 유지보수 이슈 리포트
- `NAMING_IMPROVEMENTS.md` - 파일명 개선 리포트
- `README.md` - 프로젝트 설명

**상태:** 유지 권장 (프로젝트 문서)

---

## 🎯 개선 우선순위

### 우선순위 높음 (즉시 개선)

1. **타입 안전성 개선**
   - `as any` → 적절한 타입으로 변경
   - `any[]` → 구체적인 타입 정의

### 우선순위 중간 (점진적 개선)

2. **중복 PostCSS 설정 파일 제거**
   - `postcss.config.jsx` 또는 `postcss.config.mjs` 중 하나 제거

3. **사용되지 않는 파일 확인 및 제거**
   - `swrFetcher.ts` 사용 여부 확인

### 우선순위 낮음 (선택적 개선)

4. **Console.log 정리**
   - 개발 환경에서만 출력되도록 수정
   - 또는 제거

---

## 📊 정리 효과

### Before (현재)
- ❌ 타입 안전성 문제 (14곳)
- ❌ 중복 설정 파일 (2개)
- ❌ 사용되지 않는 파일 가능성 (1개)
- ❌ Console.log 22곳

### After (개선 후)
- ✅ 타입 안전성 향상
- ✅ 중복 파일 제거
- ✅ 불필요한 파일 제거
- ✅ 프로덕션 코드 정리

---

## 🔧 권장 작업 순서

1. **타입 안전성 개선** (우선순위 높음)
   - `as any` 사용 부분 타입 명확화
   - `any[]` 구체적 타입으로 변경

2. **중복 파일 제거** (우선순위 중간)
   - PostCSS 설정 파일 하나만 유지

3. **사용되지 않는 파일 확인** (우선순위 중간)
   - `swrFetcher.ts` 사용 여부 확인 후 제거/유지 결정

4. **Console.log 정리** (우선순위 낮음)
   - 개발 환경 전용 또는 제거

