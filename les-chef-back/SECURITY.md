# 보안 가이드

## 구현된 보안 기능

### 1. 입력 검증 및 Sanitization
- 모든 사용자 입력에 대한 HTML 이스케이프 처리
- JSON 파싱 크기 제한 (1MB)
- 파일명 sanitization (경로 traversal 공격 방지)
- 아이디, 비밀번호, 닉네임 형식 검증

### 2. 파일 업로드 보안
- 허용된 MIME 타입만 허용 (JPEG, PNG, GIF, WEBP)
- 파일 크기 제한 (10MB)
- 파일 확장자 검증
- 경로 traversal 공격 방지
- 고유한 파일명 생성 (랜덤 해시 사용)

### 3. 인증 및 세션 보안
- 비밀번호 bcrypt 해싱
- 세션 쿠키 httpOnly, secure, signed 설정
- 세션 고정 공격 방지 (랜덤 세션 ID 생성)
- Rate limiting (인증 요청: 15분에 5회)

### 4. Rate Limiting
- 일반 API: 15분에 100회
- 인증 API: 15분에 5회
- 파일 업로드: 1시간에 20회

### 5. 보안 헤더 (Helmet.js)
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- 등등

### 6. MongoDB Injection 방지
- Mongoose 사용 (자동 이스케이프)
- 직접 쿼리 사용 시 주의 필요

### 7. 환경 변수 검증
- 필수 환경 변수 검증
- SESSION_SECRET_KEY 강도 검증
- CORS_ORIGIN 형식 검증

## 보안 체크리스트

### 개발 환경
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 민감한 정보가 코드에 하드코딩되지 않았는지 확인
- [ ] SESSION_SECRET_KEY가 충분히 강력한지 확인 (최소 32자)

### 프로덕션 환경
- [ ] HTTPS 사용
- [ ] 환경 변수 안전하게 관리
- [ ] 정기적인 보안 업데이트
- [ ] 로그 모니터링
- [ ] 백업 및 복구 계획

## 추가 권장 사항

1. **로그 모니터링**
   - 실패한 로그인 시도 로깅
   - 의심스러운 활동 감지

2. **2FA (Two-Factor Authentication)**
   - 중요 계정에 2FA 추가 고려

3. **CSRF 토큰**
   - 현재 세션 기반이지만 추가 보안을 위해 CSRF 토큰 고려

4. **정기적인 보안 감사**
   - 의존성 취약점 스캔 (npm audit)
   - 코드 보안 검토

5. **비밀번호 정책**
   - 현재 최소 8자, 숫자+영문자 필수
   - 필요시 더 강화 가능

