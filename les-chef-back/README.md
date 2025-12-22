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

## 📁 프로젝트 구조

```
les-chef-back/
├── src/
│   ├── index.js              # 서버 진입점
│   ├── config/
│   │   └── dbConnect.js      # MongoDB 연결 설정
│   ├── controllers/          # 비즈니스 로직
│   │   ├── recipeWrite.js    # 레시피 작성
│   │   ├── recipeGet.js      # 레시피 조회
│   │   ├── board.js          # 커뮤니티 게시판
│   │   ├── login.js          # 로그인
│   │   ├── join.js           # 회원가입
│   │   ├── foods.js          # 보관함 관리
│   │   ├── snsLogin.js       # 소셜 로그인
│   │   └── health.js         # 헬스 체크
│   ├── models/               # MongoDB 스키마
│   │   ├── userModel.js
│   │   ├── recipeModel.js
│   │   ├── recipeStepModel.js
│   │   ├── recipeIngredientsModel.js
│   │   ├── boardModel.js
│   │   ├── boardCommentModel.js
│   │   ├── boardLikeModel.js
│   │   ├── foodsModel.js
│   │   └── recipeWishListModel.js
│   ├── routers/              # API 라우팅
│   │   ├── recipe.js
│   │   ├── board.js
│   │   ├── customer.js
│   │   └── foods.js
│   ├── middleware/           # 미들웨어
│   │   ├── errorHandler.js  # 전역 에러 처리
│   │   ├── security.js       # 보안 미들웨어
│   │   └── envValidator.js   # 환경 변수 검증
│   └── uploads/              # 파일 업로드
│       └── recipeImgUpload.js
├── public/                   # 정적 파일
└── package.json
```

## 🔌 API 엔드포인트

### 인증
- `POST /api/join` - 회원가입
- `POST /api/login` - 로그인
- `POST /api/logout` - 로그아웃
- `POST /api/snsLogin` - 소셜 로그인 (카카오, 네이버)

### 레시피
- `GET /api/recipe` - 레시피 목록 조회
- `GET /api/recipe/:id` - 레시피 상세 조회
- `POST /api/recipe` - 레시피 등록
- `PUT /api/recipe/:id` - 레시피 수정
- `DELETE /api/recipe/:id` - 레시피 삭제

### 커뮤니티
- `GET /api/board` - 게시글 목록
- `GET /api/board/:id` - 게시글 상세
- `POST /api/board` - 게시글 작성
- `PUT /api/board/:id` - 게시글 수정
- `DELETE /api/board/:id` - 게시글 삭제
- `POST /api/board/:id/like` - 좋아요
- `POST /api/board/:id/comment` - 댓글 작성

### 사용자
- `GET /api/customer` - 사용자 정보 조회
- `PUT /api/customer` - 사용자 정보 수정
- `DELETE /api/customer` - 회원 탈퇴

### 보관함
- `GET /api/foods` - 보관함 조회
- `POST /api/foods` - 재료 추가
- `DELETE /api/foods/:id` - 재료 삭제

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

`.env` 파일에 다음 변수들을 설정해야 합니다:

```env
# 서버 설정
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/leschef

# 세션
SESSION_SECRET=your-secret-key

# JWT
JWT_SECRET=your-jwt-secret

# 소셜 로그인
KAKAO_CLIENT_ID=your-kakao-client-id
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# HTTPS (선택)
HTTPS_PORT=3443
SSL_CERT_PATH=./src/certs/cert.pem
SSL_KEY_PATH=./src/certs/key.pem
```

환경 변수 검증은 `envValidator.js` 미들웨어에서 자동으로 수행됩니다.

## 🚀 실행 방법

### 개발 환경
```bash
npm install
npm start  # nodemon으로 자동 재시작
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

