# 데이터베이스 초기화 가이드

## ✅ 안전하게 데이터베이스를 초기화할 수 있습니다!

현재 코드는 **데이터가 없을 때도 안전하게 동작**하도록 설계되어 있습니다.

## 🔍 현재 코드의 안전 장치

### 1. **Null 체크 처리**
모든 컨트롤러에서 데이터가 없을 때 적절히 처리합니다:

- ✅ **레시피 조회**: 데이터가 없으면 빈 배열 `[]` 반환
- ✅ **게시글 조회**: 데이터가 없으면 빈 배열 `[]` 반환
- ✅ **사용자 조회**: 데이터가 없으면 404 에러 반환
- ✅ **찜 목록**: 데이터가 없으면 빈 배열 `[]` 반환
- ✅ **보관함**: 데이터가 없으면 빈 배열 `[]` 반환

### 2. **예외 처리**
- 모든 API 엔드포인트에 `try-catch` 또는 `asyncHandler` 적용
- 데이터가 없을 때 적절한 HTTP 상태 코드 반환 (404, 200 with empty array)

### 3. **기본값 처리**
- Mongoose 스키마에 `default` 값 설정
- 빈 배열 반환으로 프론트엔드 오류 방지

## 📋 데이터베이스 초기화 방법

### 방법 1: MongoDB Atlas에서 직접 삭제 (권장)

1. MongoDB Atlas에 로그인
2. 클러스터 선택 → **Browse Collections**
3. 각 컬렉션 선택 → **Delete Collection** 클릭
4. 확인 후 삭제

### 방법 2: MongoDB Compass 사용

1. MongoDB Compass 실행
2. 연결 문자열로 연결
3. 데이터베이스 선택
4. 각 컬렉션 우클릭 → **Drop Collection**

### 방법 3: 터미널에서 삭제

```bash
# MongoDB Shell 접속
mongosh "your-connection-string"

# 데이터베이스 선택
use your-database-name

# 모든 컬렉션 삭제
db.users.drop()
db.recipes.drop()
db.recipeingredients.drop()
db.recipesteps.drop()
db.recipewishlists.drop()
db.boards.drop()
db.boardcomments.drop()
db.boardlikes.drop()
db.foodss.drop()
```

## ⚠️ 주의사항

### 1. 세션 데이터
- 세션은 MongoDB에 저장되므로 초기화 후 **모든 사용자가 로그아웃**됩니다
- 사용자는 다시 로그인해야 합니다

### 2. 파일 데이터
- 데이터베이스만 삭제하면 **업로드된 이미지 파일은 남아있습니다**
- 필요시 `public/Image/RecipeImage/` 폴더의 파일도 삭제하세요

### 3. 환경 변수
- `.env` 파일의 `DB_CONNECT` 연결 문자열은 그대로 유지하세요
- 데이터베이스 이름만 변경하고 싶다면 연결 문자열 수정

## 🧪 초기화 후 테스트

데이터베이스를 초기화한 후 다음을 테스트하세요:

### 1. 서버 시작 확인
```bash
npm start
```
- ✅ "MongoDB 연결 성공!" 메시지 확인
- ❌ 오류가 발생하면 연결 문자열 확인

### 2. 헬스체크 확인
```bash
curl https://your-server/health
```
- ✅ `"status": "healthy"` 확인
- ✅ `"database": { "connected": true }` 확인

### 3. API 테스트

**회원가입 테스트:**
```bash
POST /customer/join
{
  "id": "test@test.com",
  "pwd": "test1234",
  "nickName": "테스트"
}
```

**레시피 리스트 조회 (데이터 없음):**
```bash
GET /recipe/list
```
- ✅ 빈 배열 `[]` 반환 확인

**게시글 리스트 조회 (데이터 없음):**
```bash
GET /board/list
```
- ✅ 빈 배열 `[]` 반환 확인

## 🔄 초기화 후 정상 동작 확인 항목

- [ ] 서버가 정상적으로 시작됨
- [ ] MongoDB 연결 성공 메시지 출력
- [ ] 헬스체크 API가 정상 응답
- [ ] 회원가입이 정상 작동
- [ ] 로그인이 정상 작동
- [ ] 빈 레시피 리스트 조회 (오류 없음)
- [ ] 빈 게시글 리스트 조회 (오류 없음)
- [ ] 빈 찜 목록 조회 (오류 없음)
- [ ] 빈 보관함 조회 (오류 없음)

## 💡 추가 안전 장치

코드에 이미 구현된 안전 장치:

1. **Null 체크**: 모든 `findOne` 결과에 null 체크
2. **빈 배열 반환**: `find` 결과가 없으면 빈 배열 반환
3. **에러 핸들링**: 전역 에러 핸들러로 모든 예외 처리
4. **기본값**: Mongoose 스키마에 기본값 설정

## 🎯 결론

**데이터베이스를 완전히 비워도 오류가 발생하지 않습니다!**

현재 코드는:
- ✅ 데이터가 없을 때 빈 배열 반환
- ✅ 존재하지 않는 리소스에 대해 적절한 에러 반환
- ✅ 모든 예외 상황 처리

안심하고 데이터베이스를 초기화하셔도 됩니다! 🚀

