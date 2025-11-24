@echo off
REM SSL 인증서 생성 스크립트 (Windows)

echo 🔐 SSL 인증서 생성 중...
echo.

REM certs 디렉토리 생성
if not exist certs mkdir certs
cd certs

REM 개인키 생성
echo 1️⃣ 개인키 생성 중...
openssl genrsa -out localhost-key.pem 2048

REM 인증서 서명 요청 생성
echo 2️⃣ 인증서 서명 요청 생성 중...
openssl req -new -key localhost-key.pem -out localhost.csr -subj "/CN=localhost"

REM 자체 서명 인증서 생성
echo 3️⃣ 자체 서명 인증서 생성 중...
openssl x509 -req -days 365 -in localhost.csr -signkey localhost-key.pem -out localhost-cert.pem

REM 임시 파일 삭제
del localhost.csr

cd ..

echo.
echo ✅ SSL 인증서 생성 완료!
echo.
echo 생성된 파일:
echo   - certs/localhost-key.pem
echo   - certs/localhost-cert.pem
echo.
echo 이제 다음 명령어로 HTTPS 서버를 실행할 수 있습니다:
echo   npm run dev
echo.

pause

