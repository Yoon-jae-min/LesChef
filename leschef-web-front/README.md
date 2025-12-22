# 🎨 LesChef Web Frontend

Next.js 15 기반 프론트엔드 애플리케이션

## 📋 개요

LesChef 웹 프론트엔드는 Next.js 15의 App Router를 사용하여 구축된 모던 웹 애플리케이션입니다. TypeScript와 Tailwind CSS를 활용하여 타입 안정성과 빠른 개발을 지원합니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 15.4
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Fetch API (네이티브)

## 📁 프로젝트 구조

```
leschef-web-front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── globals.css         # 전역 스타일
│   │   ├── login/              # 로그인 페이지
│   │   ├── signup/             # 회원가입 페이지
│   │   ├── recipe/             # 레시피 페이지
│   │   │   ├── page.tsx        # 레시피 목록
│   │   │   └── [id]/          # 레시피 상세
│   │   ├── board/              # 커뮤니티 페이지
│   │   │   ├── page.tsx        # 게시글 목록
│   │   │   └── [id]/          # 게시글 상세
│   │   └── myPage/             # 마이페이지
│   │       ├── page.tsx        # 내 정보
│   │       ├── wishList/       # 찜한 레시피
│   │       └── foods/          # 보관함
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   └── common/             # 공통 컴포넌트
│   └── utils/                  # 유틸리티 함수
│       ├── authApi.ts          # 인증 API
│       ├── recipeApi.ts        # 레시피 API
│       └── boardApi.ts         # 커뮤니티 API
├── public/                     # 정적 자산
├── certs/                      # HTTPS 인증서 (개발)
└── server.js                   # HTTPS 개발 서버
```

## 🎯 주요 페이지

### 홈 (`/`)
- 메인 랜딩 페이지
- 인기 레시피 소개
- 카테고리별 빠른 접근

### 레시피 (`/recipe`)
- 레시피 목록 조회
- 카테고리 필터링
- 검색 기능
- 레시피 상세 페이지 (`/recipe/[id]`)

### 커뮤니티 (`/board`)
- 게시글 목록
- 게시글 작성/수정/삭제
- 댓글 기능
- 좋아요 기능

### 마이페이지 (`/myPage`)
- 사용자 정보 관리
- 찜한 레시피 목록 (`/myPage/wishList`)
- 보관함 관리 (`/myPage/foods`)

### 인증
- 로그인 (`/login`)
- 회원가입 (`/signup`)
- 아이디 찾기 (`/find-id`)
- 비밀번호 찾기 (`/find-password`)

## 🔌 API 통신

### API 유틸리티 구조

모든 API 호출은 `src/utils/` 폴더의 유틸리티 함수를 통해 이루어집니다:

- **authApi.ts**: 인증 관련 API (로그인, 회원가입, 로그아웃)
- **recipeApi.ts**: 레시피 관련 API (조회, 등록, 수정, 삭제)
- **boardApi.ts**: 커뮤니티 관련 API (게시글, 댓글, 좋아요)

### 에러 처리

모든 API 함수는 다음과 같은 에러 처리를 포함합니다:
- 네트워크 오류 처리
- HTTP 상태 코드 확인
- JSON 파싱 오류 처리
- 사용자 친화적인 에러 메시지

예시:
```typescript
try {
  const response = await fetch('/api/recipe');
  if (!response.ok) {
    throw new Error('레시피를 불러올 수 없습니다.');
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## 🎨 스타일링

### Tailwind CSS
- 유틸리티 퍼스트 접근 방식
- 반응형 디자인 (모바일 퍼스트)
- 커스텀 색상 및 테마

### 전역 스타일
- `src/app/globals.css`에 전역 스타일 정의
- Tailwind 디렉티브 포함

## 🔐 인증 처리

### 세션 관리
- 서버 사이드 세션 사용
- 쿠키 기반 인증
- 로그인 상태 확인

### 보호된 라우트
- 인증이 필요한 페이지는 서버에서 세션 확인
- 미인증 사용자는 로그인 페이지로 리다이렉트

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행
```bash
npm install
npm run dev        # HTTP 개발 서버
npm run dev:https  # HTTPS 개발 서버
```

### HTTPS 개발 서버
로컬 HTTPS 환경을 위해 `server.js`를 사용합니다:
```bash
npm run dev:https
```

인증서 생성은 `scripts/generate-cert.bat` (Windows) 또는 `scripts/generate-cert.sh` (Mac/Linux)를 실행하세요.

## 🏗️ 빌드 및 배포

### 개발 빌드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 환경 변수
`.env.local` 파일에 다음 변수를 설정할 수 있습니다:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📱 반응형 디자인

모바일 퍼스트 접근 방식으로 설계되었습니다:
- 모바일: 기본 스타일
- 태블릿: `md:` 브레이크포인트
- 데스크톱: `lg:` 브레이크포인트

## 🧩 컴포넌트 구조

### 공통 컴포넌트 (`src/components/common/`)
재사용 가능한 UI 컴포넌트들:
- 버튼
- 입력 필드
- 모달
- 네비게이션

### 페이지 컴포넌트 (`src/app/`)
Next.js App Router의 페이지 컴포넌트들

## 🔄 상태 관리

현재는 React의 기본 상태 관리와 서버 컴포넌트를 사용합니다:
- 클라이언트 컴포넌트: `'use client'` 디렉티브 사용
- 서버 컴포넌트: 기본 (서버 사이드 렌더링)

## 🐛 트러블슈팅

### 포트 충돌
다른 포트를 사용하려면:
```bash
npm run dev -- -p 3002
```

### HTTPS 인증서 오류
인증서를 재생성하세요:
```bash
# Windows
scripts\generate-cert.bat

# Mac/Linux
chmod +x scripts/generate-cert.sh
./scripts/generate-cert.sh
```

### API 연결 실패
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인
- 환경 변수 확인

## 📚 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)

