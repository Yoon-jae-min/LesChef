const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// SSL 인증서 경로 (여러 형식 지원)
// 환경 변수로 지정된 경로가 있으면 우선 사용 (프로덕션용)
const customCertPath = process.env.SSL_CERT_PATH;
const customKeyPath = process.env.SSL_KEY_PATH;

const certPaths = [
  // 환경 변수로 지정된 인증서 (Let's Encrypt 등 프로덕션용)
  ...(customCertPath && customKeyPath ? [{
    cert: path.isAbsolute(customCertPath) ? customCertPath : path.join(__dirname, customCertPath),
    key: path.isAbsolute(customKeyPath) ? customKeyPath : path.join(__dirname, customKeyPath),
    type: 'production'
  }] : []),
  // mkcert 형식 (브라우저 경고 없음)
  { cert: path.join(__dirname, 'certs', 'localhost+2.pem'), key: path.join(__dirname, 'certs', 'localhost+2-key.pem'), type: 'mkcert' },
  // OpenSSL 자체 서명 인증서 형식
  { cert: path.join(__dirname, 'certs', 'localhost-cert.pem'), key: path.join(__dirname, 'certs', 'localhost-key.pem'), type: 'self-signed' },
];

// 인증서 파일 존재 확인
let httpsOptions = null;
let foundCert = null;

for (const certConfig of certPaths) {
  if (fs.existsSync(certConfig.cert) && fs.existsSync(certConfig.key)) {
    httpsOptions = {
      key: fs.readFileSync(certConfig.key),
      cert: fs.readFileSync(certConfig.cert),
    };
    foundCert = certConfig.type;
    break;
  }
}

if (httpsOptions) {
  if (foundCert === 'production') {
    console.log('✅ 프로덕션 SSL 인증서를 찾았습니다. HTTPS 모드로 실행합니다.');
  } else if (foundCert === 'mkcert') {
    console.log('✅ mkcert 인증서를 찾았습니다. HTTPS 모드로 실행합니다. (브라우저 경고 없음)');
  } else {
    console.log('✅ SSL 인증서를 찾았습니다. HTTPS 모드로 실행합니다.');
    console.log('⚠️  브라우저 경고를 없애려면 mkcert 사용을 권장합니다.');
  }
} else {
  console.warn('⚠️  SSL 인증서를 찾을 수 없습니다.');
  console.warn('');
  console.warn('📝 인증서 생성 방법:');
  console.warn('');
  console.warn('   로컬 개발:');
  console.warn('   방법 1: mkcert 사용 (브라우저 경고 없음, 추천)');
  console.warn('     mkcert -install  # 한 번만');
  console.warn('     cd certs');
  console.warn('     mkcert localhost 127.0.0.1 ::1');
  console.warn('');
  console.warn('   방법 2: OpenSSL 사용 (자체 서명)');
  console.warn('     mkdir certs');
  console.warn('     cd certs');
  console.warn('     openssl genrsa -out localhost-key.pem 2048');
  console.warn('     openssl req -new -key localhost-key.pem -out localhost.csr -subj "/CN=localhost"');
  console.warn('     openssl x509 -req -days 365 -in localhost.csr -signkey localhost-key.pem -out localhost-cert.pem');
  console.warn('');
  console.warn('   프로덕션 (Let\'s Encrypt 등):');
  console.warn('     .env.local에 다음 설정:');
  console.warn('     SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem');
  console.warn('     SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem');
  console.warn('');
  console.warn('⚠️  또는 HTTP 모드로 실행하려면: npm run dev:http');
  console.warn('');
  process.exit(1);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log('');
    console.log('🚀 Next.js 서버가 실행 중입니다:');
    console.log(`   https://${hostname}:${port}`);
    console.log('');
    if (foundCert === 'self-signed') {
      console.log('⚠️  브라우저에서 "안전하지 않음" 경고가 나올 수 있습니다.');
      console.log('   "고급" → "localhost(으)로 이동"을 클릭하세요.');
      console.log('   (mkcert를 사용하면 경고가 없습니다)');
    }
    console.log('');
  });
});

