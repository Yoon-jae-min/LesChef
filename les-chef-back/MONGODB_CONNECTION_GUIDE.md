# MongoDB 연결 확인 가이드

## 1. 서버 시작 시 자동 확인

서버를 시작하면 콘솔에 MongoDB 연결 상태가 자동으로 표시됩니다:

```bash
npm start
```

**연결 성공 시:**
```
✅ MongoDB 연결 성공!
   - 호스트: your-host.mongodb.net
   - 데이터베이스: your-database-name
   - 상태: 연결됨
```

**연결 실패 시:**
```
❌ MongoDB 연결 실패:
   - 오류: [오류 메시지]
   - 인증 실패: 사용자 이름 또는 비밀번호를 확인하세요.
```

## 2. 헬스체크 API로 확인

서버가 실행 중일 때 브라우저나 터미널에서 확인:

### 브라우저에서:
```
https://your-server-address/health
```

### 터미널에서 (curl):
```bash
curl https://your-server-address/health
```

### 응답 예시:

**연결 성공:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "connected": true,
    "state": "연결됨",
    "queryTest": true,
    "host": "your-host.mongodb.net",
    "name": "your-database-name"
  },
  "server": {
    "uptime": 3600,
    "memory": {
      "used": "50 MB",
      "total": "100 MB"
    }
  }
}
```

**연결 실패:**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "connected": false,
    "state": "연결 안됨",
    "queryTest": false,
    "host": "N/A",
    "name": "N/A"
  }
}
```

## 3. Cursor 터미널에서 확인

### 방법 1: 서버 로그 확인
1. Cursor에서 터미널 열기 (Ctrl + `)
2. 서버 실행: `npm start`
3. 콘솔 출력 확인

### 방법 2: Node.js REPL 사용
```bash
node
```
그 다음:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT, { ssl: true })
  .then(() => {
    console.log('✅ 연결 성공!');
    console.log('호스트:', mongoose.connection.host);
    console.log('데이터베이스:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ 연결 실패:', err.message);
    process.exit(1);
  });
```

## 4. MongoDB 연결 상태 코드

- `0`: 연결 안됨 (disconnected)
- `1`: 연결됨 (connected)
- `2`: 연결 중 (connecting)
- `3`: 연결 해제 중 (disconnecting)

## 5. 일반적인 연결 문제 해결

### 인증 오류
```
❌ MongoDB 연결 실패:
   - 오류: authentication failed
```
**해결:** `.env` 파일의 `DB_CONNECT` 문자열에서 사용자 이름과 비밀번호 확인

### 호스트를 찾을 수 없음
```
❌ MongoDB 연결 실패:
   - 오류: getaddrinfo ENOTFOUND
```
**해결:** 
- 인터넷 연결 확인
- MongoDB Atlas 클러스터가 실행 중인지 확인
- IP 화이트리스트에 현재 IP가 추가되어 있는지 확인

### 타임아웃 오류
```
❌ MongoDB 연결 실패:
   - 오류: connection timeout
```
**해결:**
- 방화벽 설정 확인
- MongoDB Atlas 네트워크 액세스 설정 확인

## 6. 환경 변수 확인

`.env` 파일에 다음이 올바르게 설정되어 있는지 확인:

```env
DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**주의:** 
- 사용자 이름과 비밀번호에 특수문자가 있으면 URL 인코딩 필요
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- 등등

## 7. 실시간 연결 모니터링

서버 실행 중 연결 상태가 변경되면 자동으로 콘솔에 표시됩니다:

- 연결됨: `✅ MongoDB 연결됨`
- 연결 오류: `❌ MongoDB 연결 오류: [오류 메시지]`
- 연결 끊김: `⚠️  MongoDB 연결 끊김`

