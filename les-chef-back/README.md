# 🔧 LesChef Backend

Express.js 기반 백엔드 서버

## 📋 개요

LesChef 백엔드는 Express.js와 MongoDB를 사용하여 RESTful API를 제공하는 서버입니다. 레시피, 커뮤니티, 사용자 관리 등의 핵심 기능을 처리합니다.

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js 4.21
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, Express Session
- **Security**: Helmet.js, express-rate-limit, bcrypt
- **File Upload**: Multer
- **Session Store**: MongoDB (connect-mongo)

## 📁 프로젝트 구조 (요약)

```
les-chef-back/
├── src/
│   ├── index.ts                 # 서버 진입점
│   ├── config/                  # DB/환경설정
│   ├── controllers/             # 비즈니스 로직
│   ├── middleware/              # 보안/에러/검증 미들웨어
│   ├── models/                  # MongoDB 스키마
│   ├── routers/                 # 라우팅 (/customer, /recipe, /board, ...)
│   ├── utils/                   # 외부 API/로거/이메일 등 유틸
│   └── __tests__/               # 테스트
├── public/                      # 정적 파일
├── dist/                        # 빌드 결과물
└── package.json
```

## 🔌 API 엔드포인트 (대표)

### 인증
- `POST /customer/join` - 회원가입
- `POST /customer/login` - 로그인
- `GET /customer/logout` - 로그아웃
- `GET /customer/kakaoLogin` - 카카오 로그인 콜백
- `GET /customer/googleLogin` - 구글 로그인 콜백
- `GET /customer/naverLogin` - 네이버 로그인 콜백
- `POST /customer/unlink/:provider` - SNS 연동 해제 (`kakao|google|naver`)
- `POST /customer/sendVerificationCode` - 이메일 인증 코드 발송
- `POST /customer/verifyEmailCode` - 이메일 인증 코드 검증

### 레시피
- `GET /recipe/...` - 레시피 조회/검색
- `POST /recipe/...` - 레시피 등록/수정/삭제

### 커뮤니티
- `GET /board/...` - 게시글 목록/상세
- `POST /board/...` - 게시글 작성/수정/삭제

### 사용자
- `GET /customer/info` - 사용자 정보 조회
- `PATCH /customer/info` - 사용자 정보 수정
- `DELETE /customer/delete` - 회원 탈퇴

### 보관함
- `GET /foods/...` - 보관함 조회/관리

### 헬스 체크
- `GET /health` - 서버 및 DB 연결 상태 확인

## 🗄️ 데이터베이스 스키마

### User (사용자)
- id, email, password, nickname, profileImg, createdAt

### Recipe (레시피)
- id, title, description, category, mainImage, cookingTime, difficulty, servings, author

### RecipeStep (조리 단계)
- recipeId, stepNumber, description, image

### RecipeIngredients (재료)
- recipeId, name, amount

### Board (게시판)
- id, title, content, author, images, createdAt, updatedAt

### BoardComment (댓글)
- boardId, author, content, createdAt

### BoardLike (좋아요)
- boardId, userId

### Foods (보관함)
- userId, name, category, expiryDate

### RecipeWishList (찜 목록)
- userId, recipeId

## 🔐 보안 기능

### Rate Limiting
- 일반 API: 분당 100회
- 인증 API: 분당 5회
- 파일 업로드: 분당 10회

### Input Validation
- HTML 태그 이스케이프
- JSON 파싱 크기 제한
- 정규식을 통한 입력 검증

### File Upload Security
- 허용된 MIME 타입만 업로드
- 파일 크기 제한
- 확장자 검증
- Path Traversal 방지
- 고유한 파일명 생성

### Session Security
- 세션 고정 공격 방지
- 안전한 쿠키 설정
- 비밀번호 해싱 (bcrypt)

자세한 내용은 [SECURITY.md](./SECURITY.md)를 참고하세요.

## ⚙️ 환경 변수

이 프로젝트는 **`.env.example`** 를 템플릿으로 제공합니다.

- `les-chef-back/.env.example` 를 복사해서 `les-chef-back/.env` 를 만든 뒤 값만 채우면 됩니다.

```bash
cd les-chef-back
cp .env.example .env
```

환경 변수 검증은 `src/middleware/validation/envValidator` 에서 수행됩니다.

## 🚀 실행 방법

### 개발 환경
```bash
npm install
npm run dev
```

### 프로덕션 환경
```bash
npm install --production
NODE_ENV=production node src/index.js
```

## 📊 에러 처리

전역 에러 핸들러(`errorHandler.js`)가 모든 에러를 일관된 형식으로 처리합니다:
- Mongoose 에러
- JWT 에러
- 파일 시스템 에러
- 일반 에러

에러 응답 형식:
```json
{
  "success": false,
  "message": "에러 메시지",
  "error": "상세 에러 정보 (개발 환경만)"
}
```

## 🔍 헬스 체크

서버와 MongoDB 연결 상태를 확인:
```bash
curl http://localhost:3000/health
```

응답 예시:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📚 추가 문서

- [보안 가이드](./SECURITY.md)
- [MongoDB 연결 가이드](./MONGODB_CONNECTION_GUIDE.md)
- [데이터베이스 리셋 가이드](./DATABASE_RESET_GUIDE.md)
- [보안 패키지 설치 가이드](./INSTALL_SECURITY_PACKAGES.md)

## 🐛 트러블슈팅

### MongoDB 연결 실패
- MongoDB 서비스가 실행 중인지 확인
- `MONGODB_URI` 환경 변수 확인
- 방화벽 설정 확인

### 포트 충돌
- 다른 프로세스가 포트를 사용 중인지 확인
- `.env` 파일에서 포트 변경

### 세션 문제
- `SESSION_SECRET` 환경 변수 확인
- 브라우저 쿠키 설정 확인

