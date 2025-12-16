# 보안 패키지 설치 가이드

보안 기능을 사용하기 위해 다음 패키지를 설치해야 합니다:

```bash
npm install helmet express-rate-limit
```

## 설치된 패키지 설명

### 1. helmet
- 보안 HTTP 헤더를 자동으로 설정
- XSS, Clickjacking 등 공격 방지

### 2. express-rate-limit
- Rate limiting 기능 제공
- DDoS 공격 및 무차별 대입 공격 방지

## 설치 후 확인

설치가 완료되면 `package.json`에 다음 패키지가 추가되어야 합니다:

```json
{
  "dependencies": {
    "helmet": "^7.x.x",
    "express-rate-limit": "^7.x.x"
  }
}
```

## 참고사항

- `validator` 패키지는 사용하지 않습니다 (직접 구현한 sanitization 함수 사용)
- 모든 보안 기능은 이미 코드에 구현되어 있으므로 패키지 설치만 하면 됩니다

