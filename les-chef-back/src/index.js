const express = require("express");
const session = require("express-session");
const path = require('path');
const https = require('https');
const fs = require('fs');
const MongoStore = require('connect-mongo'); 
const cors = require("cors");
const helmet = require("helmet");
const { dbConnect, checkConnection } = require("./config/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, authLimiter, uploadLimiter, validateInput } = require("./middleware/security");
const validateEnvVars = require("./middleware/envValidator");

// 환경 변수 검증
validateEnvVars();

//라우터
const customer = require("../src/routers/customer");
const recipe = require("../src/routers/recipe");
const board = require("../src/routers/board");
const foods = require("../src/routers/foods");
const { healthCheck } = require("./controllers/health");

// MongoDB 연결
dbConnect().catch(error => {
    console.error('❌ DB connection error:', error);
    process.exit(1); // 연결 실패 시 프로세스 종료
});

const app = express();

// Helmet.js - 보안 헤더 설정
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // CORS와 호환을 위해
}));

// SSL 인증서 파일 경로
const options = {
    key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH)), // 비밀키 파일 경로
    cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH)) // 인증서 파일 경로
    // key: fs.readFileSync('./src/certs/private-key.pem'), // 비밀키 파일 경로
    // cert: fs.readFileSync('./src/certs/certificate.pem') // 인증서 파일 경로
};

// 세션 설정
const mongoStore = MongoStore.create({
    mongoUrl: process.env.DB_CONNECT, 
    ttl: 3600, 
    collectionName: 'sessions'
});
app.use(session({
    store: mongoStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // 기본 'connect.sid' 대신 커스텀 이름 사용
    cookie: {
        secure: true, // HTTPS에서만 전송
        maxAge: 1000 * 60 * 60, // 1시간
        httpOnly: true, // XSS 방지
        sameSite: 'none', // CORS 환경에서 필요
        signed: true, // 쿠키 서명
        domain: process.env.COOKIE_DOMAIN || undefined // 도메인 제한 (필요시)
    },
    // 세션 고정 공격 방지
    genid: function(req) {
        return require('crypto').randomBytes(16).toString('hex');
    }
}));

// CORS 설정 (세션 이후에 위치)
app.use(cors({
    // origin: ['https://localhost:3000', 'https://172.30.1.93:3000'], 
    origin: process.env.CORS_ORIGIN.split(','), 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// JSON 파싱 미들웨어 (크기 제한)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// 입력 검증 및 sanitization
app.use(validateInput);

// Rate Limiting 적용
app.use('/customer/login', authLimiter);
app.use('/customer/join', authLimiter);
app.use('/recipe/write', uploadLimiter);
app.use('/api', apiLimiter);

// 정적 파일 경로 설정 (이미지 폴더 서빙)
app.use('/Image', express.static(path.join(__dirname, '..', 'public', 'Image')));
app.use('/Video', express.static(path.join(__dirname, '..', 'public', 'Video')));

// React 빌드 파일 서빙 (빌드된 React 앱의 정적 파일들)
app.use(express.static(path.join(__dirname, '..', 'public', 'build')));

// 헬스체크 엔드포인트 (라우터 설정 전에 위치)
app.get("/health", healthCheck);

// 라우터 설정
app.use("/customer", customer);
app.use("/recipe", recipe);
app.use("/board", board);
app.use("/foods", foods);

// 404 핸들러 (API 라우트에만 적용)
app.use((req, res, next) => {
    // API 라우트인 경우에만 404 반환
    if (req.path.startsWith('/customer') || 
        req.path.startsWith('/recipe') || 
        req.path.startsWith('/board') || 
        req.path.startsWith('/foods')) {
        return res.status(404).json({
            error: true,
            message: '요청한 리소스를 찾을 수 없습니다.'
        });
    }
    next();
});

// 모든 요청에 대해 index.html 반환 (SPA 지원) - API 라우트가 아닌 경우에만
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'build', 'index.html'));
});

// 전역 에러 핸들러 (모든 라우터 이후에 위치해야 함)
app.use(errorHandler);

https.createServer(options, app).listen(443, "0.0.0.0", () => {
    console.log('HTTPS 서버가 실행 중입니다. https://158.180.94.75');
});

// https.createServer(options, app).listen(5000, "0.0.0.0", () => {
//     console.log('HTTPS 서버가 실행 중입니다. https://localhost:5000');
// });
