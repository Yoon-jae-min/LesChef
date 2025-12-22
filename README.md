# 🌐 LesChef Web Service

LesChef의 웹 서비스 플랫폼

## 📋 개요

LesChef-Web은 Next.js 기반의 프론트엔드와 Express.js 기반의 백엔드로 구성된 풀스택 웹 애플리케이션입니다. 사용자들이 레시피를 검색, 등록, 공유하고 커뮤니티에서 소통할 수 있는 기능을 제공합니다.

## 🎯 주요 기능

### 레시피 기능
- 레시피 등록, 수정, 삭제
- 카테고리별 레시피 조회 (한식, 중식, 일식, 양식)
- 재료 기반 레시피 검색
- 단계별 조리법 제공
- 레시피 찜하기 기능

### 커뮤니티 기능
- 게시글 작성, 수정, 삭제
- 댓글 작성 및 관리
- 좋아요 기능
- 게시글 검색

### 사용자 기능
- 회원가입 및 로그인
- 소셜 로그인 (카카오, 네이버)
- 프로필 관리
- 보관함 관리 (재료 목록)
- 찜한 레시피 목록

## 🏗️ 아키텍처

```
LesChef-Web/
├── les-chef-back/        # Express.js 백엔드 서버
│   ├── src/
│   │   ├── controllers/ # 비즈니스 로직
│   │   ├── models/      # MongoDB 스키마
│   │   ├── routers/     # API 라우팅
│   │   ├── middleware/  # 미들웨어 (보안, 에러 처리)
│   │   └── uploads/     # 파일 업로드 처리
│   └── public/         # 정적 파일
│
└── leschef-web-front/    # Next.js 프론트엔드
    ├── src/
    │   ├── app/         # Next.js App Router 페이지
    │   ├── components/  # 재사용 가능한 컴포넌트
    │   └── utils/       # API 유틸리티 함수
    └── public/          # 정적 자산
```

## 🛠️ 기술 스택

### 백엔드
- **Runtime**: Node.js
- **Framework**: Express.js 4.21
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, Express Session
- **Security**: Helmet.js, express-rate-limit, bcrypt

### 프론트엔드
- **Framework**: Next.js 15.4
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4

## 🔌 API 통신

프론트엔드와 백엔드는 RESTful API를 통해 통신합니다:
- 인증: JWT 토큰 기반 세션 관리
- 데이터 형식: JSON
- HTTPS 지원 (개발 환경)

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18 이상
- MongoDB
- npm 또는 yarn

### 백엔드 실행
```bash
cd les-chef-back
npm install
cp .env.example .env  # 환경 변수 설정
npm start
```

자세한 내용은 [백엔드 README](./les-chef-back/README.md)를 참고하세요.

### 프론트엔드 실행
```bash
cd leschef-web-front
npm install
npm run dev
```

자세한 내용은 [프론트엔드 README](./leschef-web-front/README.md)를 참고하세요.

## 🔐 보안 기능

- **Rate Limiting**: API 요청 제한
- **Input Validation**: 입력 데이터 검증
- **File Upload Security**: 파일 업로드 보안 (MIME 타입, 크기 제한)
- **Session Security**: 세션 고정 공격 방지
- **Security Headers**: Helmet.js를 통한 보안 헤더 설정

## 📦 배포

### 개발 환경
- 백엔드: `http://localhost:3000` (또는 HTTPS 포트)
- 프론트엔드: `http://localhost:3001` (또는 HTTPS 포트)

### 프로덕션 환경
- 환경 변수를 통해 프로덕션 설정 구성
- MongoDB 연결 문자열 설정
- HTTPS 인증서 설정

## 📖 상세 문서

- [백엔드 API 문서](./les-chef-back/README.md) - API 엔드포인트 및 서버 설정
- [프론트엔드 컴포넌트 가이드](./leschef-web-front/README.md) - UI/UX 및 컴포넌트 구조
- [보안 가이드](./les-chef-back/SECURITY.md) - 보안 기능 상세 설명
- [데이터베이스 연결 가이드](./les-chef-back/MONGODB_CONNECTION_GUIDE.md) - MongoDB 연결 방법

