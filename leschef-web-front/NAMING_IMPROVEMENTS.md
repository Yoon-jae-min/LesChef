# 파일명/폴더명 개선 제안

## 🔍 발견된 문제점

### 1. 파일명 일관성 문제 ⚠️

#### ❌ `components/common/top.tsx` (소문자 시작)
**문제점:**
- 다른 컴포넌트 파일들은 모두 PascalCase (`Top.tsx`, `HomeClient.tsx` 등)
- 소문자로 시작하는 유일한 파일
- 파일명이 너무 짧고 모호함

**현재 사용:**
```tsx
import Top from "@/components/common/top";
```

**제안:**
- `Top.tsx`로 변경 (PascalCase 일관성)
- 또는 더 명확한 이름: `Header.tsx`, `Navbar.tsx`, `Navigation.tsx`
- 현재 `Top`이라는 컴포넌트 이름과 일치하므로 `Top.tsx` 권장

**영향도:** 낮음 (내부 파일명만 변경, import 경로만 수정)

---

### 2. 혼란스러운 파일명 ⚠️

#### ❌ `app/myPage/ClientMyPageLayout.tsx` (불필요한 "Client" 접두사)
**문제점:**
- `MyPageLayout.tsx`가 더 간단하고 명확
- 다른 Client 컴포넌트들(`HomeClient.tsx`, `RecipeListClient.tsx`)은 별도 폴더에 있지 않음
- "Client" 접두사가 필요한지 불명확

**현재 구조:**
```
app/myPage/
  layout.tsx          (서버 컴포넌트)
  ClientMyPageLayout.tsx  (클라이언트 컴포넌트)
```

**제안:**
- `MyPageLayout.tsx`로 변경
- 또는 `MyPageLayoutClient.tsx`로 변경 (일관성을 위해 접미사 사용)

**영향도:** 낮음 (내부 파일명만 변경, import 경로만 수정)

---

### 3. 일관성 있는 네이밍 ✅

**현재 구조가 양호한 부분:**
- ✅ `components/common/SWRProvider.tsx` - PascalCase
- ✅ `components/recipe/RecipeCard.tsx` - PascalCase
- ✅ `components/home/HomeClient.tsx` - PascalCase
- ✅ `utils/authUtils.ts` - camelCase (유틸리티는 camelCase)
- ✅ `constants/storageKeys.ts` - camelCase (상수 파일은 camelCase)
- ✅ `config/apiConfig.ts` - camelCase (설정 파일은 camelCase)

---

## 📊 개선 제안 요약

### 우선순위 높음 (즉시 개선 권장)

1. **`top.tsx` → `Top.tsx`**
   - 이유: 파일명 일관성 (PascalCase)
   - 영향: 낮음 (import 경로만 수정)
   - 파일 수정: 1개 파일명 변경
   - import 수정: 모든 `top` import를 `Top`으로 변경

2. **`ClientMyPageLayout.tsx` → `MyPageLayout.tsx`**
   - 이유: 불필요한 "Client" 접두사 제거, 명확성 향상
   - 영향: 낮음 (import 경로만 수정)
   - 파일 수정: 1개 파일명 변경
   - import 수정: `layout.tsx`의 import만 수정

### 우선순위 낮음 (선택적 개선)

3. **폴더명 통일 (선택적)**
   - `myPage` vs `my-page` - Next.js는 kebab-case 권장하지만 현재 구조도 괜찮음
   - 변경 시 영향도가 높음 (URL 경로, 라우팅 등)
   - 현재 상태 유지 권장

---

## 🎯 권장 개선 작업

### 작업 1: `top.tsx` → `Top.tsx` 변경

**변경할 파일:**
- `src/components/common/top.tsx` → `src/components/common/Top.tsx`

**수정할 import:**
- 모든 파일에서 `import Top from "@/components/common/top"` → `import Top from "@/components/common/Top"`

**영향 파일 수:** 약 20-30개 파일

### 작업 2: `ClientMyPageLayout.tsx` → `MyPageLayout.tsx` 변경

**변경할 파일:**
- `src/app/myPage/ClientMyPageLayout.tsx` → `src/app/myPage/MyPageLayout.tsx`

**수정할 import:**
- `src/app/myPage/layout.tsx`에서만 import 사용

**영향 파일 수:** 1개 파일

---

## 📈 개선 효과

### Before (현재)
- ❌ `top.tsx` - 소문자 시작, 일관성 부족
- ❌ `ClientMyPageLayout.tsx` - 불필요한 접두사

### After (개선 후)
- ✅ `Top.tsx` - PascalCase 일관성
- ✅ `MyPageLayout.tsx` - 명확하고 간결한 이름

**효과:**
- 파일명 일관성 **100%** 달성
- 코드 가독성 **향상**
- 팀 협업 시 혼란 **감소**

---

## 🔧 개선 작업 순서

1. ✅ `top.tsx` → `Top.tsx` 변경
   - 파일명 변경
   - 모든 import 경로 수정

2. ✅ `ClientMyPageLayout.tsx` → `MyPageLayout.tsx` 변경
   - 파일명 변경
   - `layout.tsx`의 import 수정

---

## ⚠️ 주의사항

### 변경하지 말아야 할 것
- ❌ `myPage` 폴더명 → `my-page` (URL 경로 변경 필요, 영향도 높음)
- ❌ 기존 API 파일명 (`authApi.ts`, `recipeApi.ts` 등 - 이미 일관성 있음)
- ❌ 페이지 파일명 (`page.tsx`, `layout.tsx` - Next.js 컨벤션)

### 변경 후 확인사항
- ✅ 모든 import 경로가 올바르게 수정되었는지 확인
- ✅ 빌드 에러 없이 컴파일되는지 확인
- ✅ 런타임 에러 없이 동작하는지 확인

