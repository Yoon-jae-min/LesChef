# SSL 인증서 생성 가이드

이 폴더에 SSL 인증서 파일을 생성해야 HTTPS로 개발 서버를 실행할 수 있습니다.

## 🚀 방법 1: OpenSSL 사용 (기본)

### Windows (Git Bash 또는 PowerShell):
```bash
# certs 폴더로 이동
cd certs

# 개인키 생성
openssl genrsa -out localhost-key.pem 2048

# 인증서 서명 요청 생성
openssl req -new -key localhost-key.pem -out localhost.csr -subj "/CN=localhost"

# 자체 서명 인증서 생성
openssl x509 -req -days 365 -in localhost.csr -signkey localhost-key.pem -out localhost-cert.pem
```

### Mac/Linux:
```bash
cd certs

# 개인키 생성
openssl genrsa -out localhost-key.pem 2048

# 인증서 서명 요청 생성
openssl req -new -key localhost-key.pem -out localhost.csr

# 자체 서명 인증서 생성
openssl x509 -req -days 365 -in localhost.csr -signkey localhost-key.pem -out localhost-cert.pem
```

**생성된 파일:**
- `localhost-key.pem` (개인키)
- `localhost-cert.pem` (인증서)

---

## 🎯 방법 2: mkcert 사용 (추천, 브라우저 경고 없음)

### 1단계: mkcert 설치

**Windows (Chocolatey):**
```bash
choco install mkcert
```

**Mac:**
```bash
brew install mkcert
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

### 2단계: 로컬 CA 설치
```bash
mkcert -install
```

### 3단계: 인증서 생성
```bash
cd certs
mkcert localhost 127.0.0.1 ::1
```

**생성된 파일:**
- `localhost+2-key.pem` (개인키)
- `localhost+2.pem` (인증서)

### 4단계: server.js 수정 (mkcert 사용 시)

mkcert를 사용한 경우 파일 이름이 다르므로 `server.js`의 파일명을 수정해야 합니다:
- `localhost-cert.pem` → `localhost+2.pem`
- `localhost-key.pem` → `localhost+2-key.pem`

---

## ✅ 확인

인증서가 생성되었는지 확인:
```bash
ls certs/
```

다음 파일들이 있어야 합니다:
- `localhost-key.pem` (또는 `localhost+2-key.pem`)
- `localhost-cert.pem` (또는 `localhost+2.pem`)

---

## 🚀 실행

인증서 생성 후:
```bash
npm run dev
```

결과: `https://localhost:3000` 에서 실행

---

## ⚠️ 브라우저 경고 처리

자체 서명 인증서 사용 시:
1. 브라우저에서 "안전하지 않음" 경고 표시
2. "고급" 클릭
3. "localhost(으)로 이동" 클릭
4. 한 번만 하면 이후 자동으로 인식

**mkcert 사용 시**: 경고 없이 자동으로 신뢰됨 (추천)

